import { zApi } from '@dian/app-utils'

// 获取代理商列表
export const fetchAllocatableBDApi = (params: { nickName: string }) => {
  return zApi.get('/yangtze/api/v1/merchant/merchants/allocatable-BD', { params })
}

// 获取代理商列表
export const allocatableBDApi = (params: { accountId: string, targetUserId: string, assignContractFlag: boolean }) => {
  return zApi.patch(`/yangtze/api/v1/merchant/merchants/${params.accountId}/allocate`, { targetUserId: params.targetUserId, assignContractFlag: params.assignContractFlag })
}
