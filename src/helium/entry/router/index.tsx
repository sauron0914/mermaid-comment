import type { RouteObject } from 'react-router-dom'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import type { ComponentType } from 'react'
import { generateRoutes } from './utils'
import { PrivateLayout } from '@/common/layout/private-layout'
import { basename } from '../utils'
type ReplaceId<T> = T extends `${infer U}:id${infer V}` ? (`${U}${string}${V}` | ReplaceId<`[id:]${U}[id]${V}`>) : T;

export type RoutePath = ReplaceId<
  typeof publicRoutes[number]['path'] | typeof privateRoutes[number]['path']
> extends infer R ? (R extends string ? R : never) : never;

export type EnhanceRoute = Pick<RouteObject, 'path'> & {
  title: string
  component: () => Promise<{ default: ComponentType}>
}

const publicRoutes = [
  {
    path: '/404',
    title: '404',
    component: () => import('@/pages/404'),
  },
  {
    path: '/wujie-test/:id',
    title: 'helium-test',
    component: () => import('@/pages/wujie-test'),
  },
  {
    path: '/wujie-test/:id/list',
    title: 'helium-list',
    component: () => import('@/pages/wujie-test/list/index'),
  },
  {
    path: '/form/demo',
    title: 'form-demo',
    component: () => import('@/pages/form/demo'),
  },
] as const

const privateRoutes = [
  {
    path: '/agent/list',
    title: '代理商管理',
    component: () => import('@/pages/agent/list'),
  },
  {
    path: '/agent/create',
    title: '创建代理商管理',
    component: () => import('@/pages/agent/create'),
  },
  {
    path: '/agent/:id/detail',
    title: '创建代理商管理',
    component: () => import('@/pages/agent/detail'),
  },
  {
    path: '/agent/bank/list',
    title: '创建代理商管理',
    component: () => import('@/pages/agent/bank/list'),
  },
  {
    path: '/agent/check',
    title: '创建代理商管理',
    component: () => import('@/pages/agent/check'),
  },
  {
    path: '/agent/change-sharing',
    title: '变更分成',
    component: () => import('@/pages/agent/change-sharing'),
  },
  {
    path: '/agent/sharing-record',
    title: '变更分成记录',
    component: () => import('@/pages/agent/sharing-record'),
  },
  {
    path: '/agent/bank/create',
    title: '创建银行卡信息',
    component: () => import('@/pages/agent/bank/create'),
  },
  {
    path: '/capital-acount',
    title: '资金账户',
    component: () => import('@/pages/capital-acount/index'),
  },
  {
    path: '/capital-acount/list',
    title: '收支明细',
    component: () => import('@/pages/capital-acount/list/index'),
  },
  {
    path: '/paymen-record/list',
    title: '账户收支明细',
    component: () => import('@/pages/capital-acount/paymenRecord/index'),
  },
  {
    path: '/cash-record/list',
    title: '提现记录',
    component: () => import('@/pages/capital-acount/cashRecord/index'),
  },
  {
    path: '/auth/record',
    title: '认证记录',
    component: () => import('@/pages/auth/record'),
  },
  {
    path: '/auth/record/detail',
    title: '认证记录详情',
    component: () => import('@/pages/auth/detail'),
  },
  {
    path: '/merchant/guide',
    title: '创建商户引导',
    component: () => import('@/pages/merchant/guide'),
  },
  {
    path: '/merchant/check',
    title: '商户创建校验',
    component: () => import('@/pages/merchant/check'),
  },
  {
    path: '/merchant/check-result',
    title: '商户创建',
    component: () => import('@/pages/merchant/check-result'),
  },
  {
    path: '/merchant/create',
    title: '商户创建',
    component: () => import('@/pages/merchant/create'),
  },
  {
    path: '/merchant/list',
    title: '商户列表',
    component: () => import('@/pages/merchant/list'),
  },
  {
    path: '/merchant/detail',
    title: '商户详情',
    component: () => import('@/pages/merchant/detail'),
  },
  {
    path: '/merchant/claim',
    title: '申请认领商户',
    component: () => import('@/pages/merchant/claim'),
  },
  {
    path: '/merchant/associated-shops',
    title: '关联门店',
    component: () => import('@/pages/merchant/associated-shops'),
  },
  {
    path: '/merchant/assign-BD',
    title: '分配BD',
    component: () => import('@/pages/merchant/assign-BD'),
  },
] as const

const router = createBrowserRouter([
  ...generateRoutes(publicRoutes),
  {
    element: <PrivateLayout />,
    children: generateRoutes(privateRoutes),
  },
  {
    path: '/',
    element: <Navigate to="/agent/list" />,
  },
  {
    path: '*',
    element: <Navigate to="/404" />,
  },
], {
  basename,
})

export default router
