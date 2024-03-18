/**
 * @fileoverview 应用中的cookie读写操作
 */
import { cookie } from '@dian/app-utils'
import { getNowMonthbefore } from './time'

getNowMonthbefore()

// o.dian.so => dian.so; localhost => localhost;
const subDomain = window.location.hostname.split('.').slice(-2)
  .join('.')

const cookieOptions = {
  expires: 30,
  httpOnly: false,
  domain: subDomain,
  path: '/',
}

export function getUserId () {
  return +cookie.get('userId')
}

export function setUserId (val: string) {
  cookie.set('userId', val, Object.assign({}, cookieOptions, { expires: 0 }))
}

export function getNickName () {
  return cookie.get('nickName')
}

export function setRole (val: string) {
  cookie.set('role', val, cookieOptions)
}

export function getUserAgentId () {
  return +cookie.get('userAgentId')
}
