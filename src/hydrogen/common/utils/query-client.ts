import { QueryClient } from '@tanstack/react-query'
import { Toast } from 'antd-mobile'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError (err) {
        Toast.show((err as RequestError)?.message || (err as RequestError)?.msg || '未知错误')
      },
    },
    mutations: {
      onError (err) {
        Toast.show((err as RequestError)?.message || (err as RequestError)?.msg || '未知错误')
      },
    },
  },
})
