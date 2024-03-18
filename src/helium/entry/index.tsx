import '@dian/polyfill'
import './global-style.css'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { GlobalContainer } from '../common/store'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './utils'
import { initZod } from '@/common/utils/zod'
import { RouterProvider } from 'react-router-dom'
import { Loading } from '@/common/components/loading'
import { initXkey, isRealEnv } from '@dian/app-utils'
import router from './router'
import { qiankunWindow, renderWithQiankun } from '@dian/vite-plugin-qiankun/helper'

initZod()
// 初始化埋点
initXkey({
  appKey: 'kcypfs6kh3rtwp',
  debug: !isRealEnv(), // 线上环境则上传到real
  watchXhr: false,
  appDesc: 'helium',
})

let root = ReactDOM.createRoot(document.getElementById('helium-root') as HTMLElement)

function render () {
  // @ts-ignore: _internalRoot为内部属性
  if (!root._internalRoot) {
    root = ReactDOM.createRoot(document.getElementById('helium-root') as HTMLElement)
  }
  root.render(
    <StrictMode>
      <GlobalContainer.Provider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} fallbackElement={<Loading />} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </GlobalContainer.Provider>
    </StrictMode>,
  )
}

function renderSubApp () {
  renderWithQiankun({
    mount () {
      render()
    },
    bootstrap () {
      //
    },
    unmount () {
      root.unmount()
    },
    update () {
      //
    },
  })
}

renderSubApp()
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}
