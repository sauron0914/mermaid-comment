import '@dian/polyfill' // import polyfills
import './global-style.css'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { GlobalContainer } from '../common/store'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../common/utils/query-client'
import { RouterProvider } from 'react-router-dom'
import { Loading } from '@/common/components/loading'
import { qiankunWindow, renderWithQiankun } from '@dian/vite-plugin-qiankun/helper'
import { initXkey, isRealEnv } from '@dian/app-utils'
import router from './router'

// 初始化埋点
initXkey({
  // @ts-ignore: todo
  appKey: 'kcypfs6kh3rtwp',
  debug: !isRealEnv(), // 线上环境则上传到real
  watchXhr: false,
  appDesc: 'hydrogen',
})

let root = ReactDOM.createRoot(document.getElementById('hydrogen-root') as HTMLElement)

function render () {
  // @ts-ignore: _internalRoot为内部属性
  if (!root._internalRoot) {
    root = ReactDOM.createRoot(document.getElementById('hydrogen-root') as HTMLElement)
  }
  root.render(
    <StrictMode>
      <GlobalContainer.Provider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} fallbackElement={<Loading />} />
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

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
} else renderSubApp()
