import { zApi } from '@/common/utils/api'

export interface MobileParams{
    mobile: string
    source?: string
}

export interface AgentBasicInfoResponse {
  statusType: number
  tip: string
}

// 校验代理商信息
export const fetchAgentBasicInfo = (params: MobileParams) => {
  return zApi.get('/yangtze/api/v1/agent/check', {
    params: {
      ...params,
    },
  })
}

export const fetchSMSCode = (params: MobileParams) => {
  return zApi.post('/yangtze/api/v1/agent/sms-code',
    params)
}

export const fetchSMSCodeCheck = (params: MobileParams) => {
  return zApi.post('/yangtze/api/v1/agent/sms-code/check',
    params)
}
