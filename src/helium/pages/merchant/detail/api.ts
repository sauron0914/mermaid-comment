import { zApi } from '@/common/utils/api'

interface CodesParams{
  resCodeList: string[]
}
// 获取认证记录
export const getAuthRecord = (params) => {
  return zApi.get('/yangtze/api/v1/auth/record', { params })
}
// 获取商户详情-基本信息
export const getMechantDetail = (params) => {
  return zApi.get(`/yangtze/api/v1/merchant/merchants/${params.id}/detail`)
}
// 获取商户详情-认证信息
export const getAuthList = (params) => {
  return zApi.get(`mch-passport/passport/h5/manage/${params.id}/approve`)
}

// 获取商户详情-认证信息
export const deleteIdentifyInfo = (params) => {
  return zApi.delete(`/yangtze/api/v1/auth/${params.id}`)
}

// 获取权限数据
export const fetchPageOperatorAuthority = (params: CodesParams) => {
  return zApi.post('/permission/resource/authorized/query', params)
}
// ca认证
export const registerCA = (id) => {
  return zApi.post(`/scrm/customer/h5/manage/authentication/${id}/register`)
}
// 读取脱敏信息
export const readnSensitiveData = (params) => {
  return zApi.post('/agent/data/mask', params)
}
