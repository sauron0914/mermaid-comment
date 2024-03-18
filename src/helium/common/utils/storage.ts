import { BLS } from '@dian/app-utils'
const ls = window.localStorage

// 全局localStorage实例
export const bls = new BLS({ namespace: 'global' })

export function getIsVentureCompany () {
  return ls.getItem('isVentureCompany') === 'true'
}
