import { zApi } from '@/common/utils/api'

export interface MobileParams{
  mobile: string
}

export interface directParams {
  id: number
}

// 校验代理商信息
export const fetchMerchantBasicInfoByMobile = (params: MobileParams) => {
  return zApi.get('/yangtze/api/v1/merchant/manage/create/check', {
    params: {
      ...params,
    },
  })
}

export const directClaim = (params: directParams) => {
  return zApi.patch(`/yangtze/api/v1/merchant/manage/direct-claim/${params.id}`,
    params)
}
