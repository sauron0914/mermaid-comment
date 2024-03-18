import { cookie, zApi } from '@dian/app-utils'
import { useQuery } from '@tanstack/react-query'
import type { ResourceTree } from './types'
import { href } from '@dian/app-utils/href'
import { getIsHonor } from '@/common/utils/storage'

export function useAgentStatus () {
  return useQuery({
    enabled: !getIsHonor(),
    queryKey: ['/agent/1.0/agent/query/state'],
    async queryFn ({ queryKey }) {
      const res1 = await zApi.get(queryKey[0])
      const res2 = await zApi.get('/agent/1.0/agent/query/chargeState')
      return { ...res1, ...res2 }
    },
    cacheTime: 5 * 60 * 1000,
    onSuccess (data) {
      const {
        // agentId, //
        accountId, // 帐户id。提交认证的时候需要用到
        isBindBankCard, // 是否绑卡
        isAuth, // 是否认证
        // isBindContract, // 是否签约合同
        kuaiSource, // 快手直播的标示

        selfSettledSource, // 个代自主注册的标示
        isBindingContract, // 是否签合同
        isBindContract,
        signingUrl, // 上上签链接
        agentId,
        mobile, // 登录手机号
      } = data

      if (kuaiSource) {
        if (!isAuth) {
          href('mammon', `/external/kuaishou/step1?id=${accountId}`)
        } else if (isAuth && !isBindBankCard) {
          href('mammon', `/external/kuaishou/step2?id=${accountId}`)
        }
      }
      if (selfSettledSource) { // 自主注册
        if (!isAuth) { // 是否认证
          href('mammon', `/a/certification-to-sign?agentId=${agentId}&accountId=${accountId}&contactTel=${mobile}`)
        } else if (!isBindBankCard) { // 是否已经绑卡
          href('mammon', `/a/certification-to-sign?curStep=2&agentId=${agentId}&accountId=${accountId}`)
        } else if (!isBindContract && !isBindingContract) { // 是否签约，流程中
          href('mammon', `/a/certification-to-sign?curStep=3&agentId=${agentId}&accountId=${accountId}`)
        } else if (isBindingContract && !isBindContract) { // 跳转至 上上签页面
          window.location.href = signingUrl
        }
      }
    },
  })
}

export const useDashboard = () => {
  useAgentStatus()
  return useQuery({
    queryKey: ['/nile/api/v1/dashboard/config', cookie.get('current_role')],
    queryFn: ({ queryKey }) => zApi.get<ResourceTree | null>(queryKey[0]),
  })
}

export const useTabResource = () => {
  return useQuery({
    queryKey: ['/nile/api/v1/dashboard/config/sub/1.1.9998'],
    queryFn: ({ queryKey }) => zApi.get<ResourceTree | null>(queryKey[0]),
  })
}

export const useAllTools = () => {
  const { data } = useDashboard()
  return data?.children.filter(item => item.component === 'Tools')
}

export function useUserRoles () {
  return useQuery({
    queryKey: ['/shield/v1/manage/userRoles'],
    queryFn: ({ queryKey }) => zApi.get(queryKey[0]),
    cacheTime: 5 * 60 * 1000,
    select (data) {
      return data.map((item) => {
        const {
          channelType,
          depLevel,
          departName,
          deptId,
          nickName,
          userId,
          roleName,
        } = item
        return {
          userId,
          deptId,
          nickName,
          deptName: departName,
          deptLevel: depLevel,
          organization: channelType,
          roleName,
        }
      })
    },
  })
}

// 获取是否弹框
export const fetchStandardPopup = (payload) => {
  return zApi.get('/nile/api/v1/dashboard/config/tip', { params: payload })
}

// 记录当前弹框
export const recordStandardPopup = (payload) => {
  return zApi.post('/nile/api/v1/dashboard/config/tip/confirm', payload)
}
