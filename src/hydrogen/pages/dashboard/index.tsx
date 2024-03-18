import { useDashboard, useTabResource, useUserRoles } from './api'
import { PullToRefresh, Tabs } from 'antd-mobile'
import { useEffect, useRef } from 'react'
import { Widgets } from './widgets'
import { ServiceButton } from './components/service-button'
import type { WidgetRef } from './types'
import './styles.css'
import { href } from '@dian/app-utils/href'
import Empty, { EmptyType } from '@/common/components/empty'
import { Anchor } from './components/anchor'
import { DashboardSkeleton } from './components/skeleton'
import TopHeader from './widgets/data-center/organization/top-header'
import { getNickName } from '@/common/utils/cookie'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { showNavigation, showSideMenu } from '@dian/bridge'
import { BottomNav } from './widgets/bottom-nav'
import { StandardReminderPopup } from './components/standard-reminder-popup'

function Dashboard () {
  const { data, isLoading } = useDashboard()
  const { data: tabResource } = useTabResource()
  const { data: roleList } = useUserRoles()
  const refreshRef = useRef<Record<string, WidgetRef | null>>({})

  useEffect(() => {
    showNavigation({ show: false })
    return () => {
      showNavigation({ show: true })
    }
  }, [])

  async function handleRefresh () {
    return Promise.allSettled(
      Object.values(refreshRef.current).map(refresh => refresh?.fetchData?.()),
    )
  }

  function handleTabClick (tab) {
    if (tab === 'workorder-aboard') {
      href('honor', '/configHome/workorder-center/dashboard')
    }
  }

  const handleClickNickname = () => {
    showSideMenu({ fullScreen: true })
  }

  if (isLoading) {
    return (
      <div>
        <div className="animate-pulse h-10 flex items-center justify-between px-3 mt-2">
          <div className="bg-gray-200 h-full w-32" />
          <div className="bg-gray-200 h-8 w-8 rounded-full" />
        </div>
        <div className="animate-pulse h-9 bg-gray-200 my-2" />
        <DashboardSkeleton />
      </div>
    )
  }

  if (!data?.children?.length) {
    return (
      <div className="mt-20">
        <Empty type={EmptyType.NoData} text="暂无首页配置" />
      </div>
    )
  }

  return (
    <div className="hydrogen-dashboard bg-gray-100 pt-[80px]">
      <div className="bg-white fixed top-0 w-full z-10">
        <div className="flex justify-between shadow">
          <Tabs
            className="border-b-0 font-bold px-1"
            activeKey="home"
            onChange={handleTabClick}
          >
            <Tabs.Tab title="首页" key="home" />
            {!!tabResource && (
              <Tabs.Tab title="工单看板" key="workorder-aboard" />
            )}
          </Tabs>
          <div
            className="flex flex-none w-40 px-2 items-center justify-end box-border"
            onClick={handleClickNickname}
          >
            <div className="pr-1 overflow-hidden text-gray-600">
              <div className="text-gray-900 text-right truncate">{getNickName()}</div>
              <TopHeader
                key="1"
                userOrganization={roleList?.[0]}
                className="organization"
              />
            </div>
            <img
              className="flex-none w-7 h-7 rounded-full ml-1 object-cover"
              src="https://fed.dian.so/image/9e2eb6572ff5c2abb8b4899a3f7d8c36.png"
            />
          </div>
        </div>

        <Anchor
          offsetTop={80}
          items={data?.children
            ?.filter(item => !!item.component)
            ?.map(item => ({ title: item.resName, id: item.resCode }))}
        />
      </div>

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="min-h-screen px-2 pt-2 pb-12 space-y-3">
          {data &&
            data.children &&
            data.children.map((config, index) => {
              const Component = config.component
                ? Widgets[config.component]
                : null
              if (Component) {
                return (
                  <div key={index} id={config.resCode}>
                    <Component
                      {...config}
                      userOrganization={roleList?.[0]}
                      key={index}
                      ref={(ref) => {
                        refreshRef.current[config.resCode] = ref
                      }}
                    />
                  </div>
                )
              }
              return null
            })}
        </div>
      </PullToRefresh>
      <ServiceButton />
      <StandardReminderPopup />
    </div>
  )
}

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})
export default function DashboardRoute () {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
      <BottomNav currentApp="1.1.9999.1" beforeJump={() => showNavigation({ show: true })} />
    </QueryClientProvider>
  )
}
