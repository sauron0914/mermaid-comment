import { zApi } from '@/common/utils/api'

export interface MobileParams{
    mobile: string
    source?: string
}

// export interface MerchantBasicInfoResponse {
//   statusType: number
//   tip: string
// }

// 校验代理商信息
export const fetchMerchantBasicInfo = (params: MobileParams) => {
  return zApi.get('/yangtze/api/v1/merchant/manage/create/check', {
    params: {
      ...params,
    },
  })
}

// export const fetchSMSCode = (params: MobileParams) => {
//   return zApi.post('/yangtze/api/v1/merchant/sms-code',
//     params)
// }

// export const fetchSMSCodeCheck = (params: MobileParams) => {
//   return zApi.post('/yangtze/api/v1/merchant/sms-code/check',
//     params)
// }
