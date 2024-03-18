import { zApi } from '@dian/app-utils'
import { useQuery } from '@tanstack/react-query'

export const useUserInfo = () => {
  return useQuery({
    queryKey: ['/nile/api/v1/dashboard/user-info'],
    queryFn: ({ queryKey }) => zApi.get(queryKey[0]),
  })
}
