import type { CacheData } from './types'

export const setDeptCache = (deptId, userId, organization) => {
  sessionStorage.setItem('org-deptId', deptId)
  sessionStorage.setItem('org-userId', userId)
  sessionStorage.setItem('org-organization', organization)
}

export const setRoleCache = (deptId, userId, organization) => {
  sessionStorage.setItem('org-asDeptId', deptId)
  sessionStorage.setItem('org-asUserId', userId)
  setDeptCache(deptId, userId, organization)
}

export const getCache = (): CacheData => {
  const asDeptId = sessionStorage.getItem('org-asDeptId') || undefined
  const asUserId = sessionStorage.getItem('org-asUserId') || undefined
  const deptId = sessionStorage.getItem('org-deptId') || undefined
  const userId = sessionStorage.getItem('org-userId') || undefined
  const organization = sessionStorage.getItem('org-organization') || undefined
  return { asDeptId, asUserId, deptId, userId, organization }
}

type RoleValue = {
  deptId?: string
  userId?: string
}
export const findRole = ({ deptId, userId }: RoleValue, roleList) => {
  if (roleList instanceof Array) {
    return roleList.find(
      item => item.deptId === deptId && item.userId === userId,
    )
  }
}
