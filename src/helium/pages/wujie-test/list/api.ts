import { zApi } from '@/common/utils/api'

// 获取品类
export const fetchAllTypes = () => {
  return zApi.get('/ultron/shopType/getType', {})
}

// 获取商机列表
export const fetchListByPage = (params: { currentPage: number, offset: number, pageSize: number, status: number }) => {
  return zApi.post('/scrm/businessManage/private/app/business/v2/listByPage', params)
}
