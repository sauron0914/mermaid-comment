import { zApi } from '@dian/app-utils'
import { useQuery } from '@tanstack/react-query'
import { CodeMap, initPageMap } from './utils'

export const useNavResource = (levelList) => {
  return useQuery({
    queryKey: ['/nile/api/v1/dashboard/config/sub/bottom-nav'],
    enabled: !!levelList,
    async queryFn ({ queryKey }) {
      const data = await zApi.get(queryKey[0])

      if (!data) return []

      if (window.localStorage.getItem('isVentureCompany') === 'true') {
        data.children = data.children.filter(item => item.resName !== '帮助中心')
      }

      const isPre = window.location.origin.includes('pre')
      let origin = ''
      if (window.location.origin.includes('support')) {
        origin = isPre ? 'https://o.dian-pre.com' : 'https://o.dian.so'
      } else {
        origin = window.location.origin
      }
      return data?.children.map((item) => {
        return {
          ...item,
          title: item.resName,
          icon: item.iconUrl,
          activeIcon: item.iconBack ?? item.iconUrl,
          link: item.accessUrl.indexOf('http') === -1 ? origin + item.accessUrl : item.accessUrl,
          selected: levelList[CodeMap[item.resCode]]?.includes(window.location.pathname),
        }
      })
    },
  })
}

export const useFirstLevelList = () => {
  return useQuery({
    queryKey: ['/varuna/1.0/config/get?configName=varuna-nav.yaml'],
    initialData: initPageMap,
    queryFn ({ queryKey }) {
      try {
        return zApi.get(queryKey[0])
      } catch (error) {
        return initPageMap
      }
    },
  })
}
