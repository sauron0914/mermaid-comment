import { zApi } from '@dian/app-utils'
import { useMutation } from '@tanstack/react-query'
import { getOsInfo } from '@dian/bridge'
import { isDianXiaoErApp } from './utils'
import { Modal, Toast } from 'antd-mobile'

export interface LoginResult {
  isNewIndex: number;
  returnToken: string;
  roleId: number;
  roleName: string;
  userId: number;
  white: boolean;
  xdEmp: number;
  nick: string;
  loginAgentType: number;
}

type Account = {
  username: string;
  password: string;
  loginType: number;
  isGray?: boolean;
};

export const useSMSCode = () => {
  return useMutation<any, any, Pick<Account, 'username' | 'isGray'>>({
    async mutationFn ({ username }) {
      zApi.get('/nile/api/v1/account/check-gray', {
        params: { mobile: username },
      }).then((data) => {
        if (data === false) {
          Modal.alert({ title: '提示', content: '虚拟账号无法通过验证码登录！请钉钉联系南空或秋吟为您设置登录密码！' })
        }
      })

      return await zApi.post('/clotho/send/login/sms', {
        mobile: username,
      })
    },
    onError (error) {
      Toast.show(error.msg)
    },
  })
}

export const useLogin = () => {
  return useMutation<
    any,
    any,
    // 登录方式:1:手机号码 2：用户名+密码
    Account
  >({
    mutationFn ({ username, password, loginType }) {
      if (isDianXiaoErApp) {
        // 获取设备信息提交
        return new Promise((resolve) => {
          getOsInfo(({ success, data }) => {
            if (success) resolve(data)
            else resolve(null)
          })
        }).then((osInfo: any) => {
          return zApi.post('/clotho/login', {
            loginKey: username,
            loginValue: password,
            loginType,
            extStr: osInfo
              ? `登录地址：${osInfo.province}${osInfo.city}${osInfo.area}${osInfo.street};登录设备类型：${osInfo.osModel},${osInfo.osPlatform}${osInfo.osVersion};经纬度：${osInfo.userLatitude},${osInfo.userLongitude}`
              : '',
          })
        })
      }
      // 不在电小二里登录
      return zApi.post('/clotho/login', {
        loginKey: username,
        loginValue: password,
        loginType,
      })
    },
  })
}

export const usePCLogin = () => {
  return useMutation<
    any,
    any,
    // 登录方式:1:手机号码 2：用户名+密码
    { uuid: string; token: string; agentEmployeeId: number }
  >({
    mutationFn ({ uuid, token, agentEmployeeId }) {
      return zApi.post('/clotho/login/polling/confirm', {
        uuid,
        token,
        agentEmployeeId,
      })
    },
  })
}
