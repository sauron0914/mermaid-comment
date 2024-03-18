import { zApi } from '@/common/utils/api'

export const addAgentFeeRate = (params) => {
  return zApi.post<boolean>('/yangtze/api/v1/agent/fee/rate/add', params)
}
