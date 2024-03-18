import { zApi } from '@/common/utils/api'

// 认证记录列表
export const fetchSharingRecordList = (params) => {
  return zApi.post('/yangtze/api/v1/agent/fee/rate/list', params)
}
