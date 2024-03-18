import { hosts, getEnv, getStableUrl, getDevUrl } from '@dian/app-utils'

type HostsType = 'real' | 'pre' | 'stable' | 'dev' | 'local'

export const allHosts = {
  // add your hosts
  real: {
    C_HOST: 'https://c.dian.so',
  },
  pre: {
    C_HOST: 'https://c.dian-pre.com',
  },
  stable: {
    C_HOST: getStableUrl('c'),
  },
  dev: {
    C_HOST: getDevUrl('c'),
    MICRO_TEST_HOST: getDevUrl('micro-test'),
  },
  // 仅用于本地开发代理
  local: {
    C_HOST: 'http://localhost:5173',
    O_HOST: 'http://localhost:5173',
  },
}

const env = { ...hosts, ...allHosts[getEnv() as HostsType] }

export { env }
