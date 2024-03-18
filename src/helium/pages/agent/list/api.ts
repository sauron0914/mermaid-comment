import { zApi } from '@/common/utils/api'

interface CustomerListParams{
  pageSize: number
  pageNo: number
  keyWord?: string | null | number
}

interface CodesParams{
  resCodeList: string[]
}
export interface CheckAgentParams {
  agentId: number;
}

// 获取代理商列表
export const fetchAgentCustomerList = (params: CustomerListParams) => {
  return zApi.post('/yangtze/api/v1/agent/list', params)
}

// 获取权限数据
export const fetchPageOperatorAuthority = (params: CodesParams) => {
  return zApi.post('/permission/resource/authorized/query', params)
}

// 获取是否是个人代理
export const fetchAgentIsPerson = () => {
  return zApi.get('/yangtze/api/v1/agent/biz/type', {})
}

// 获取是否是在灰度
export const fetchAgentIsCreateGray = () => {
  return zApi.get('/yangtze/api/v1/agent/create/gray', {})
}

// 校验是否有审批中的变更分成
export const checkAgentFeeRateExits = (params: CheckAgentParams) => {
  return zApi.get('/yangtze/api/v1/agent/fee/rate/exits', { params })
}
