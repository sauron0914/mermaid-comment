import { zApi } from '@/common/utils/api'

type AgentLevel = {
  id: number
  name: string
  desc: string
  feeRate: number
  eamount: number
  samount: number
}

// 获取地址位置
export const fetchAddressList = () => {
  return zApi.get('/virgo/getAllNew')
}

export const fetchAgentLevelList = () => {
  return zApi.get<AgentLevel[]>('/agent/agent/level/list')
}

export const fetchAgentCreate = (params) => {
  return zApi.post<number>('/yangtze/api/v1/agent/create', params)
}

export const fetchAgentHierarchy = () => {
  return zApi.get<number>('/yangtze/api/v1/agent/hierarchy')
}
