/**
 * @fileoverview 这个模块是为了兼容原来的电小二/电小代，保证ls的前缀和原来保持一致，业务代码无需修改
 * @author 唯刃<weiren.dian.so>
 */

// https://git.dian.so/fed/honor/-/blob/master/src/common/utils/storage/utils.ts#L4
// https://git.dian.so/fed/mammon/-/blob/master/src/common/utils/storage/utils.ts#L4
const prefixHonor = 'honor/4.17.22/'
const prefixMammon = 'mammon/4.17.22/'
const prefixGlobal = 'dian-globals/1.0.0/' // 用于存储全局信息，电小二/电小代是一样的，似乎不用改？？

const ls = window.localStorage
// 是否是 honor
export function setIsHonor (val: boolean) { ls.setItem('isHonor', String(val)) }
export function getIsHonor () { return ls.getItem('isHonor') === 'true' }

// 可以返回对应的前缀（设置之后）
export function getLocalPrefix () {
  return getIsHonor() ? prefixHonor : prefixMammon
}

export function getGlobalPrefix () {
  return prefixGlobal
}
