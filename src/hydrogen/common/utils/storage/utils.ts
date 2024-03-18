import { getLocalPrefix } from './compat'

// storage所有的key之前都加上prefix
export const globalPrefix = 'dian-globals/1.0.0/'

export function JSONparse (str) {
  return str ? JSON.parse(str) : str
}

export function setLocalStorageItem (key, val) {
  const storagePrefix = getLocalPrefix()
  window.localStorage.setItem(storagePrefix + key, val)
}

export function getLocalStorageItem (key) {
  const storagePrefix = getLocalPrefix()
  return window.localStorage.getItem(storagePrefix + key)
}

export function removeLocalStorageItem (key) {
  const storagePrefix = getLocalPrefix()
  window.localStorage.removeItem(storagePrefix + key)
}

export function setSessionStorageItem (key, val) {
  const storagePrefix = getLocalPrefix()
  window.sessionStorage.setItem(storagePrefix + key, val)
}

export function getSessionStorageItem (key) {
  const storagePrefix = getLocalPrefix()
  return window.sessionStorage.getItem(storagePrefix + key)
}

export function removeSessionStorageItem (key) {
  const storagePrefix = getLocalPrefix()
  window.sessionStorage.removeItem(storagePrefix + key)
}

// 清理之前版本的key
export function cleanStorage (storage) {
  const storagePrefix = getLocalPrefix()
  Object.keys(storage).forEach((key) => {
    if (!key.startsWith(storagePrefix)) {
      storage.removeItem(key)
    }
  })
}
