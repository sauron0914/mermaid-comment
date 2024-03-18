import { isPreEnv, isRealEnv } from '@dian/app-utils'
import { getUserId, getNickName } from './cookie'

export function connectQiYu (extra) {
  const name = getNickName() || ''
  const userId = getUserId() || ''

  let url = 'https://m-alter-849533509969121280.six.dian-dev.com/qiyu'
  if (isRealEnv()) {
    url = 'https://m.dian.so/qiyu'
  } else if (isPreEnv()) {
    url = 'https://m.dian-pre.com/qiyu'
  }

  return `${url}?uid=${userId}&name=${name}&level=5&wp=1&robotShuntSwitch=1${extra || ''}`
}
