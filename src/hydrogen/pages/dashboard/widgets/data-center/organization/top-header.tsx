import { useState, useEffect, useCallback } from 'react'
import FilterChildren from './filter-children'
import { setAsRole, useUserRoles } from './org-service'
import type { TopHeaderProp } from './types'
import { getCache, setRoleCache } from './utils'

function TopHeader (props: TopHeaderProp) {
  const { className, renderChildren, onInit } = props
  const { data: roleList } = useUserRoles()
  const [init, setInit] = useState(false)

  useEffect(() => {
    if (roleList.length > 0) {
      if (init === false) {
        onInit && onInit(roleList[0])
      }
      setInit(true)
    }
  }, [roleList, onInit, init])

  // 缓存设置1小时
  return (
    <FilterChildren
      disabled
      className={className}
      lastRole={roleList[0]}
      deptData={roleList[0]}
      roleList={roleList}
      renderChildren={renderChildren}
    />
  )
}

type Callback = () => void

// 跳转前检查角色用
TopHeader.useCheckRole = (currentRole) => {
  const cache = getCache()
  const [needSetAsRole, setNeedSetAsRole] = useState<boolean>()
  const [callbackList, setCallbackList] = useState<Callback[]>([])

  useEffect(() => {
    if (currentRole) {
      const { deptId, userId } = currentRole
      if (deptId !== cache.deptId || userId !== cache.userId) {
        setNeedSetAsRole(true)
      } else {
        setNeedSetAsRole(false)
      }
    }
  }, [currentRole, cache.deptId, cache.userId])

  useEffect(() => {
    const fetch = async () => {
      const { deptId, userId, organization } = currentRole
      await setAsRole(deptId, userId)
      setRoleCache(deptId, userId, organization)
      setNeedSetAsRole(false)
    }
    if (needSetAsRole === true && callbackList.length > 0) {
      fetch()
    } else if (needSetAsRole === false && callbackList.length > 0) {
      callbackList.forEach(cellback => cellback())
      setCallbackList([])
    }
  }, [needSetAsRole, callbackList, currentRole])

  const checkRole = useCallback(
    (callback) => {
      const theCallback = callback || (() => undefined)
      setCallbackList([...callbackList, theCallback])
    },
    [currentRole],
  )

  return checkRole
}

export default TopHeader
