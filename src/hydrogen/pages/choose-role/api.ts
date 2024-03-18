import { zApi } from '@dian/app-utils'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { Tenant } from './types'

export interface UserInfo {
  agentId: number;
  departmentId: number;
  employeeNo: string;
  id: number;
  nickName: string;
  realStatus: number;
  role: number;
  status: number;
  userRoles: number[];
}

export const useRoles = (options: UseQueryOptions<Tenant[]>) => {
  return useQuery<Tenant[]>({
    queryKey: ['/clotho/login/user/role/list'],
    queryFn: () => zApi.post('/clotho/login/user/role/list'),
    refetchOnWindowFocus: false,
    ...options,
  })
}

export const useSelectRole = (options) => {
  return useMutation<
    any,
    any,
    {
      roleCode: string;
      tenantId: string;
    }
  >({
    ...options,
    mutationFn (params) {
      return zApi.post('/clotho/login/user/role/confirm', params)
    },
  })
}
