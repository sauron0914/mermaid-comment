import { AGENT_ROLE, SELLER_ROLE } from '@/common/constants'
import { getUserId, setRole } from '@/common/utils/cookie'
import { cookie } from '@dian/app-utils'

export const setAgentRole = () => setRole(AGENT_ROLE)

export const setSellerRole = () => setRole(SELLER_ROLE)

function logout () {
  cookie.removeSpecific(Object.keys(cookie.all()), {
    domain: location.hostname.replace(/(o|c)(-alter-\w*)?/, ''),
    path: '/',
  })
}

export {
  getUserId,
  logout,
}
