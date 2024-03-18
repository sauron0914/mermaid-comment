import Error from '../../components/error'
import { Loading } from '../../components/loading'

export function Layout ({ isLoading, error, children }) {
  if (isLoading) return <Loading />
  if (error) return <Error text={error.message || error.msg} />
  return <>{children}</>
}
