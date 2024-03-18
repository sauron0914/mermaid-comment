import { hosts, getEnv, getStableUrl, getDevUrl } from '@dian/app-utils'

type HostsType = 'real' | 'pre' | 'stable' | 'dev' | 'local'

const HOST = `https://${window.location.host}`

export const allHosts = {
  // add your hosts
  real: {
    HOST,
    C_HOST: 'https://c.dian.so',
    DC_HOST: 'https://dcapi.dian.so',
  },
  pre: {
    HOST,
    C_HOST: 'https://c.dian-pre.com',
    DC_HOST: 'https://dcapi.dian-pre.com',
  },
  stable: {
    HOST,
    C_HOST: getStableUrl('c'),
    DC_HOST: getStableUrl('dcapi'),
  },
  dev: {
    HOST,
    C_HOST: getDevUrl('c'),
    DC_HOST: getDevUrl('dcapi'),
  },
  // 仅用于本地开发代理
  local: {
    HOST: `${window.location.protocol}//${window.location.host}`, // 本地环境可能是http
    C_HOST: '/@c',
    DC_HOST: '/@dcapi',
  },
}

const env = { ...hosts, ...allHosts[getEnv() as HostsType] }

export { env }
