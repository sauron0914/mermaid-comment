import { zApi } from '@/common/utils/api'

interface CodesParams{
  resCodeList: string[]
}

// 获取代理商银行卡列表
export const fetchAgentBankList = (params) => {
  return zApi.get('/yangtze/api/v1/agent/bank-list', {
    params,
  })
}

// 获取权限数据
export const fetchPageOperatorAuthority = (params: CodesParams) => {
  return zApi.post('/permission/resource/authorized/query', params)
}

// 获取代理商详情
export const fetchAgentDetail = (params) => {
  return zApi.get(`/yangtze/api/v1/agent/${params.id}/detail`)
}
