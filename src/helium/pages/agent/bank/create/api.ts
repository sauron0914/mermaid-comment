import { zApi } from '@/common/utils/api'

interface PersonalSupportInfo{
  subType: number, // 1企业 2. 个人
  supportPersonal: number, // 1. 支持 0或空 不支持
}
// 获取代理商银行卡列表
export const addAgentBankList = (params) => {
  return zApi.post('/yangtze/api/v1/agent/bank/add', params)
}

// 获取是否支持个卡
export const fetchAgentPersonalSupport = (params) => {
  return zApi.get<PersonalSupportInfo>(`/yangtze/api/v1/agent/personal-support/${params.id}`)
}
