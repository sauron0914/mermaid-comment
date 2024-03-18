/**
 * @fileoverview 应用入口的工具函数
 * @author 唯刃<weiren@dian.so>
 */
import { QueryClient } from '@tanstack/react-query'
import { qiankunWindow } from '@dian/vite-plugin-qiankun/helper'

/**
 * 全局react-query实例
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

// 由主应用加载/独立运行
const isInSubapp = !!qiankunWindow.__POWERED_BY_QIANKUN__

// basename需要区分，否则主应用加载后刷新就变成了单独运行
export const basename = isInSubapp ? '/elements/helium' : '/helium'
