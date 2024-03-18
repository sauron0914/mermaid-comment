import { zApi } from '@/common/utils/api'

export interface CreateParams {
  mobile: string,
  name: string,
  contact: string,
  address: string,
  city: number,
  cityName: string,
  district: number,
  districtName: string,
  contactMobile: string
}

export interface CreateOutInfo {
  accountId: number,
  merchantId: number,
}

export const fetchMerchantCreate = (params: CreateParams) => {
  return zApi.post<CreateOutInfo>('/yangtze/api/v1/merchant/manage/create', params)
}
