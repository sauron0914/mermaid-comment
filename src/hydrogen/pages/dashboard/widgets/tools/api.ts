import { zApi, BLS, cookie } from '@dian/app-utils'
import { useQuery } from '@tanstack/react-query'
import type { ResourceTree } from '../../types'
import { useEffect, useState } from 'react'
import { useDashboard } from '../../api'

export const bls = new BLS({ namespace: 'hydrogen/dashboard' })
const roleName = cookie.get('current_role')

export const useAllTools = () => {
  const { data } = useDashboard()
  return data?.children.filter(item => item.component === 'Tools')
}

export const useToolsConfig = (options?) => {
  return useQuery<
    { defaultTools: string[]; badgeTools: Record<string, string> },
    any,
    any,
    any
  >({
    queryKey: ['/nile/api/v1/dashboard/config/tools-config'],
    queryFn: ({ queryKey }) => zApi.get<ResourceTree[]>(queryKey[0]),
    ...options,
  })
}

export const useCommonToolsCodeList = () => {
  const cacheTools = bls.get(`commonTools-${roleName}`)

  const { data } = useToolsConfig({ enabled: !cacheTools })

  const state = useState(cacheTools ?? [])

  useEffect(() => {
    const [tools, setTools] = state
    if (!tools.length && data) setTools(data.defaultTools)
  }, [data, state])

  return state
}

export const useCommonTools = (commonToolsCodeList) => {
  const { data } = useDashboard()

  const allTools =
    data?.children?.filter(item => item.component === 'Tools') ?? []

  const commonTools = allTools
    .map(item =>
      item.children?.filter(icon =>
        commonToolsCodeList.includes(icon.resCode)))
    .filter(Boolean)
    .flat(2)

  const filterAllTools = allTools.map((item) => {
    return {
      ...item,
      children: item.children?.filter(
        icon => !commonToolsCodeList.includes(icon.resCode),
      ),
    }
  })

  return { commonTools, allTools: filterAllTools }
}

export function useBadgeContent () {
  const { data: toolsConfig } = useToolsConfig()

  return useQuery({
    queryKey: ['/directsale/remix-index/getCornerMarker'],
    queryFn: ({ queryKey }) => zApi.get(queryKey[0]),
    staleTime: Infinity,
    enabled: !!toolsConfig?.badgeTools,
    select (data) {
      const cornerMarkVOList = data?.cornerMarkVOList ?? []
      const badgeTools = toolsConfig?.badgeTools

      return Object.fromEntries(Object.entries(badgeTools).map(([resCode, itemName]) => {
        const item = cornerMarkVOList.find(item => item.toolCode === itemName)
        if (item?.markType !== 1) return []
        return [resCode, item.markContent]
      }))
    },
  })
}
