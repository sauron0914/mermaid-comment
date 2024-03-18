import { zApi } from '@/common/utils/api'

// 认证记录列表
export const fetchAuthRecordList = (params) => {
  return zApi.get('/yangtze/api/v1/auth/record', {
    params,
  })
}
