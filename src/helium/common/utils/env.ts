import { cookie } from '@dian/app-utils'

export const isHonor = window.localStorage.getItem('isHonor') === 'true' // 是否是honor

export const target: 'honor' | 'mammon' = isHonor ? 'honor' : 'mammon'

// 获取当前角色
export const currentRole = cookie.get('current_role')
