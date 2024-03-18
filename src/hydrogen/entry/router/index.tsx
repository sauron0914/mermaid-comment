import type { RouteObject } from 'react-router-dom'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import type { ComponentType } from 'react'
import { generateRoutes } from './utils'
import { PrivateLayout } from '@/common/components/layout/private-layout'
import { basename } from '../utils'

type ReplaceId<T> = T extends `${infer U}:id${infer V}`
  ? `${U}${string}${V}` | T
  : T;

export type RoutePath = ReplaceId<
  (typeof publicRoutes)[number]['path'] | (typeof privateRoutes)[number]['path']
> extends infer R
  ? R extends string
    ? R
    : never
  : never;

export type EnhanceRoute = Pick<RouteObject, 'path'> & {
  title: string;
  component: () => Promise<{ default: ComponentType }>;
};

const publicRoutes = [
  {
    path: '/login',
    title: '登录',
    component: () => import('@/pages/login'),
  },
  {
    path: '/not-found',
    title: '404',
    component: () => import('@/pages/not-found'),
  },
  {
    path: '/wujie-test/:id',
    title: 'hydrogen',
    component: () => import('@/pages/wujie-test'),
  },
] as const

const privateRoutes = [
  {
    path: '/choose-role',
    title: '选择公司&角色',
    component: () => import('@/pages/choose-role'),
  },
  {
    path: '/pc-login',
    title: '扫码登录',
    component: () => import('@/pages/login/pc-login'),
  },
  {
    path: '/scan-login',
    title: '扫码登录',
    component: () => import('@/pages/login/scan-login'),
  },
  {
    path: '/dashboard',
    title: '首页',
    component: () => import('@/pages/dashboard'),
  },
  {
    path: '/dashboard/all-tools',
    title: '所有工具',
    component: () => import('@/pages/dashboard/all-tools'),
  },
  {
    path: '/dashboard/common-tools',
    title: '编辑常用工具',
    component: () => import('@/pages/dashboard/common-tools-edit'),
  },
  {
    path: '/messages/center',
    title: '消息中心',
    component: () => import('@/pages/messages/center'),
  },
  {
    path: '/messages/:bizTypeCode',
    component: () => import('@/pages/messages/list'),
  },
  {
    path: 'integrity/report',
    title: '廉政举报',
    component: () => import('@/pages/integrity'),
  },
] as const

const router = createBrowserRouter(
  [
    {
      element: <PrivateLayout />,
      children: generateRoutes(privateRoutes),
    },
    ...generateRoutes(publicRoutes),
    {
      path: '/',
      element: <Navigate to="/login" />,
    },
    // {
    //   path: '*',
    //   element: <Navigate to="/not-found" />,
    // },
  ],
  {
    basename,
  },
)

export default router
