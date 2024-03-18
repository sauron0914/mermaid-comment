import { zApi } from '@/common/utils/api'

export interface DeleteAgentAuthParams {
  subjectId: number // 认证主体Id
}

export interface AccountStatusParams {
  agentId: number;
  workState: number; // (1-生效 0-失效)
}

export interface CheckAgentParams {
  agentId: number;
}

interface CodesParams{
  resCodeList: string[]
}

// 获取代理商详情
export const fetchAgentDetail = (params) => {
  return zApi.get(`/yangtze/api/v1/agent/${params.id}/detail`)
}

// 删除认证信息
export const deleteIdentifyInfo = (params: DeleteAgentAuthParams) => {
  return zApi.delete(`/yangtze/api/v1/agent/auth/${params.subjectId}`)
}

// 冻结
export const updateAgentAccountStatus = (params: AccountStatusParams) => {
  return zApi.patch('/yangtze/api/v1/agent/status/modify', params)
}

// 获取权限数据
export const fetchPageOperatorAuthority = (params: CodesParams) => {
  return zApi.post('/permission/resource/authorized/query', params)
}

// 认证记录列表
export const fetchAuthRecordList = (params) => {
  return zApi.get('/yangtze/api/v1/auth/record', {
    params,
  })
}

// 认证记录列表
export const setAgentRatio = (params) => {
  return zApi.patch('/yangtze/api/v1/agent/modify/ratio', params)
}

// 对二级代理渠道经理灰度
export const getChanelManagerRatioGrayList = (params) => {
  return zApi.post('/yangtze/api/v1/agent/gray-list/check', {
    ...params,
    type: 'heliumWithdrawGrayList',
  })
}

// 校验是否有审批中的变更分成
export const checkAgentFeeRateExits = (params: CheckAgentParams) => {
  return zApi.get('/yangtze/api/v1/agent/fee/rate/exits', { params })
}
