import { zApi } from '@dian/app-utils'

export const fetchWorkOrderData = (params) => {
  return zApi.get('/directsale/remix-index/getData', {
    params,
  })
}
