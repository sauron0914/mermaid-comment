import { useMemo, createContext, forwardRef } from 'react'
import PanelList from './panel-list'
import { useToastQuery } from '@dian/common/hooks/react-query'
import { fetchConfig, fetchIndexDatas } from './api'
import Empty, { EmptyType } from '@/common/components/empty'
import type { WidgetProps, WidgetRef } from '../../types'

function CRMHome ({ deptRole }) {
  const { userId, deptId } = deptRole ?? {}

  const { data: configData } = useToastQuery({
    cacheTime: 0,
    queryKey: ['fetchConfig'],
    queryFn: () => fetchConfig({ deptId, userId }),
  })

  const indexDatas = useToastQuery({
    queryKey: ['fetchIndexDatas'],
    queryFn: () =>
      fetchIndexDatas({
        dateType: '3', // crm首页应该只展示月度数据，没切换
        productId: 2,
        deptId,
        userId,
      }),
  })

  const tabs = useMemo(() => {
    if (!configData) {
      return []
    }
    return configData.map(e => ({
      title: e.name,
      key: `${e.id}`,
      tabType: e.type,
    }))
  }, [configData])

  return <PanelList data={indexDatas} tabs={tabs} userRole={deptRole} />
}

export const UserOrganization = createContext({})

const DataCenter = forwardRef<WidgetRef, WidgetProps>(function DateCenter (
  props,
) {
  const { userOrganization } = props
  if (!userOrganization) {
    return <Empty type={EmptyType.NoPermission} />
  }

  return <CRMHome deptRole={userOrganization} />
})

export default DataCenter
