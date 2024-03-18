import { BLS } from '@dian/app-utils'
import { setLocalStorageItem as setItem } from './utils'

const ls = window.localStorage
export const bls = new BLS({ namespace: 'hydrogen/login' })

export function setLoginRole (val) {
  ls.setItem('xiaodian-login-role', val)
}

export function getLoginRole () {
  return ls.getItem('xiaodian-login-role')?.replace(/"/g, '')
}

export function setHasCRMGray (val) {
  setItem('hasCRMGray', !!val)
}

export function setIsCRMWhiteList (val) {
  setItem('isCRMWhiteList', !!val)
}

// 是否是合资公司
export function setIsVentureCompany (val) {
  ls.setItem('isVentureCompany', val)
}

export function getIsVentureCompany () {
  return ls.getItem('isVentureCompany') === 'true'
}

export function removeLoginRole () {
  ls.removeItem('xiaodian-login-role')
}
