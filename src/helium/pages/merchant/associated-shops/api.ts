import { zApi } from '@dian/app-utils'

// 获取商户下的门店
export const fetchAssociatedShopsApi = (params: { merchantId: number, pageNo: number, pageSize: number }) => {
  return zApi.get(`/yangtze/api/v1/merchant/merchants/${params.merchantId}/shops`, { params: { pageNo: params.pageNo, pageSize: params.pageSize } })
}
