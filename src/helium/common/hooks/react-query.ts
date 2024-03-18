import { useQuery, useMutation } from '@tanstack/react-query'
/**
 * @fileoverview 封装 react-query，提供了一些常用功能
 * @author 唯刃<weiren@dian.so>
 */
import type { QueryKey, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { Toast } from 'antd-mobile'
export * from '@tanstack/react-query'

function onError (err) {
  Toast.show((err as RequestError)?.message || (err as RequestError)?.msg || '未知错误')
}

export type UseToastQueryOptions<
  TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey
> = [Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'initialData'> & { initialData?: () => undefined }]
| [Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'initialData'> & { initialData: TQueryFnData | (() => TQueryFnData)}]
| [UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>]

// 默认toast错误信息，不需要每次都写onError，其它参数和useQuery一样
export function useToastQuery<
  TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey
> (
  ...args: UseToastQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) {
  const opts = args[args.length - 1]
  return useQuery({ ...opts, onError })
}

type UseToastMutationOptions<TData = unknown, TError = unknown, TVariables = void, TContext = unknown> =
[UseMutationOptions<TData, TError, TVariables, TContext>]

export function useToastMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown> (
  ...args: UseToastMutationOptions<TData, TError, TVariables, TContext>
) {
  const opts = args[args.length - 1]
  return useMutation({ ...opts, onError })
}
