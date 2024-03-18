import {
  globalPrefix,
} from './utils'

const ss = window.sessionStorage

export function setRoleType (val) {
  // TODO: remove 临时兼容逻辑
  ss.setItem('xiaodian-login-roletype', String(+val))
}

export function removeBindDeviceInfo () {
  ss.removeItem(`${globalPrefix}bindDeviceInfo`)
}

export function setScanInfo (obj) {
  // TODO: remove 临时兼容逻辑
  ss.setItem('xiaodian-scan-info', JSON.stringify(obj))
}
