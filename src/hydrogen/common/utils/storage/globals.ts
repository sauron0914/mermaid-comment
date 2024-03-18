/**
 * @fileoverview 全局
 */
import { globalPrefix, JSONparse } from './utils'

// const ls = window.localStorage
const ss = window.sessionStorage

const aupKey = `${globalPrefix}asset-units-permission`
export function setAssetUnitsPermission (obj) { ss.setItem(aupKey, JSON.stringify(obj)) }
export function getAssetUnitsPermission () { return JSONparse(ss.getItem(aupKey)) }
export function removeAssetUnitsPermission () { ss.removeItem(aupKey) }

const GrayTagListKey = `${globalPrefix}GrayTagList`
const grayTagList = ['tool_business_manage_list', 'shop_bo_create']
export function setGrayTagList () { ss.setItem(GrayTagListKey, JSON.stringify(grayTagList)) }
export function getGrayTagList () { return JSONparse(ss.getItem(GrayTagListKey)) }
export function removeGrayTagList () { ss.removeItem(GrayTagListKey) }
