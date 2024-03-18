import type { EnhanceRoute } from './index'
import { lazy } from 'react'
import { AsyncComponent } from '@dian/ui-common'
import type { RouteObject } from 'react-router-dom'
import { Loading } from '@/common/components/loading'

const DomTitle = ({ title }) => {
  document.title = title
  return null
}

export const generateRoutes: (routes) => RouteObject[] = (routes) => {
  return routes.map((item: EnhanceRoute) => {
    const { path, component, ...rest } = item
    const Element = lazy(component)
    return {
      element: (
        <AsyncComponent delay={200} fallback={<Loading />}>
          <DomTitle title={item.title} />
          <Element />
        </AsyncComponent>
      ),
      path,
      ...rest,
    }
  })
}
