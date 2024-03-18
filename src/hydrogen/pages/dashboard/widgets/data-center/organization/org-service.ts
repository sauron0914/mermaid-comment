import { useMemo, useState, useEffect } from 'react'
import { zApi } from '@dian/app-utils'
import type { RoleData } from './types'
import { useQuery } from '@dian/common/hooks/react-query'

export function useUserRoles () {
  const [userList, setUserList] = useState<RoleData[]>([])

  useQuery({
    queryKey: ['/shield/v1/manage/userRoles'],
    queryFn: ({ queryKey }) => zApi.get(queryKey[0]),
    cacheTime: 5 * 60 * 1000,
    onSuccess (data) {
      if (data instanceof Array) {
        const list = data.map((item) => {
          const {
            channelType,
            depLevel,
            departName,
            deptId,
            nickName,
            userId,
            roleName,
          } = item
          return {
            userId,
            deptId,
            nickName,
            deptName: departName,
            deptLevel: depLevel,
            organization: channelType,
            roleName,
          }
        })
        setUserList(list)
      }
    },
  })

  return useMemo(() => {
    return { data: userList }
  }, [userList])
}

type DeptListParams = {
  asDeptId?: string | null
  asUserId?: string | null
  deptId?: string | null
  userId?: string | null
  organization?: string | null
}

export function useDeptList (params: DeptListParams = {}) {
  const { asDeptId, asUserId, deptId, userId, organization } = params
  const [deptList, setDeptList] = useState<RoleData[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await zApi.post(
          '/deus-ex-machina/organization/v1/getByDep',
          { asDeptId, asUserId, deptId, userId, organization },
        )
        if (data instanceof Array) {
          const list = data.map((item) => {
            const {
              departmentId: deptId,
              departmentName: deptName,
              userId,
              nickName,
              hasChildren,
              organization,
              role,
              roleName,
            } = item
            return {
              deptId,
              deptName,
              userId,
              nickName,
              deptLevel: role,
              organization: organization || 'All',
              hasChildren,
              roleName,
            }
          })
          setDeptList(list)
        }
      } catch (error) {
        setError(error)
      }

      setLoaded(true)
    }
    if (deptId && organization) {
      fetch()
    }
  }, [asDeptId, asUserId, deptId, userId, organization])

  return { data: deptList, loaded, error }
}

export async function setAsRole (deptId, userId) {
  await zApi.post('/shield/v1/permission/setAsRole', { deptId, userId })
  return {}
}
