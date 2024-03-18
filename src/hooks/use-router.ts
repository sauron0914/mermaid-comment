import type { RoutePath } from '../../entry/router'
import { useRouter as useDefaultRouter } from '@dian/app-utils/router'
import type { NavigateOptions, URLSearchParamsInit } from 'react-router-dom'

type To = RoutePath | Partial<{
    pathname: RoutePath;
    query: URLSearchParamsInit;
}>;

interface NavigateFunction {
  (to: To, options?: NavigateOptions): void;
  (delta: number): void;
}

const useRouter = () => {
  const { navigator, ...rest } = useDefaultRouter()
  const customerNavigate: NavigateFunction = navigator.navigate as any

  return {
    navigator: {
      ...navigator,
      navigate: customerNavigate,
    },
    ...rest,
  }
}

export { useRouter }
