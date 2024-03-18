import { useOutlet } from 'react-router-dom'
import { cookie } from '@dian/app-utils'
import { useRouter } from '@dian/app-utils/router'
import { useEffect } from 'react'
import { Watermark } from '@dian/ui-common'
import { GlobalContainer } from '@/common/store'

export const PrivateLayout = () => {
  const { navigator } = useRouter()
  const outlet = useOutlet()
  const { watermark } = GlobalContainer.useContainer()
  useEffect(() => {
    const isLoggedIn = () => !!cookie.get('newToken') || !!cookie.get('dsid')

    if (!isLoggedIn) {
      navigator.navigate('/login')
    }
  }, [navigator])

  return (
    <>
      <Watermark text={watermark} />
      {outlet}
    </>
  )
}
