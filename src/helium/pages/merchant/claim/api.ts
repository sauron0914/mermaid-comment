import { zApi } from '@dian/app-utils'

// 商户申请认领
export const applyClaimApi = (params: { applyReason: string, merchantId: number }) => {
  return zApi.patch(`/yangtze/api/v1/merchant/merchants/${params.merchantId}/apply-cliam`, { applyReason: params.applyReason })
}
