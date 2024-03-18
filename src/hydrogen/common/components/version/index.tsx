import type React from 'react'
import packageJson from '../../../../package.json'
import { useRouter } from '@dian/app-utils/router'

export const Version: React.FC = () => {
  const { navigator } = useRouter()

  return (
    <div
      className="fixed left-2 bottom-2"
      onClick={() => navigator.navigate('/wujie-test/121')}
    >
      {packageJson.gitHead.substring(0, 6)}
    </div>
  )
}
