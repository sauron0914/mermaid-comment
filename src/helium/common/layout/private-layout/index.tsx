import { useOutlet } from 'react-router-dom'
import { cookie } from '@dian/app-utils'
import { useRouter } from '../../hooks/use-router'
import { useEffect } from 'react'

export const PrivateLayout = () => {
  const isLoggedIn = () => !!cookie.get('dsid')
  const { navigator } = useRouter()
  const outlet = useOutlet()

  useEffect(() => {
    if (!isLoggedIn()) {
      navigator.href('hydrogen', '/login')
    }
  }, [navigator])

  return (
    <>
      {outlet}
    </>
  )
}
