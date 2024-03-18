import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import type { NavItemProps } from './nav-item'
import { useFirstLevelList, useNavResource } from './api'
import NavItem from './nav-item'
import { isDianXiaoErApp } from '@/pages/login/utils'
import type { ResourceTree } from '../../types'
import { href } from '@dian/app-utils/href'
import { call as BridgeCall } from '@dian/bridge'

export interface BottomNavProps {
  /** 指明当前应用 */
  currentApp?: string;
  /** 导航列表 */
  items?: NavItemProps[];
  /** 跳转之前的回调 */
  beforeJump?: () => void;
}

export interface BottomNavRef {
  // 刷新底部导航条
  fetchData?: () => void;
}

export const BottomNav = forwardRef<BottomNavRef, BottomNavProps>(
  function BottomNav ({ currentApp, items, beforeJump }, ref) {
    const { data: levelList } = useFirstLevelList()
    const { data, refetch } = useNavResource(levelList ?? {})
    const [inApp, setInApp] = useState(isDianXiaoErApp)

    const navResourceTree = items ?? data

    useImperativeHandle(ref, () => ({
      fetchData () {
        refetch()
      },
    }))

    useEffect(() => {
      if (!navResourceTree?.length || !inApp) return

      BridgeCall('showTabs', {
        show: navResourceTree.length > 0 && inApp,
        levelList,
        tabInfoList: navResourceTree,
      }).catch(() => {
        setInApp(false)
      })
    }, [inApp, levelList, navResourceTree])

    const handleChange = (e) => {
      if (e.resCode === currentApp) return
      beforeJump?.()
      href('global', e.link)
    }

    const renderItem = (item: ResourceTree) => {
      const { resName, resCode, iconUrl, iconBack, accessUrl } = item
      const active: boolean = currentApp
        ? currentApp === item.resCode
        : item.accessUrl
          ? window.location.pathname.includes(item.accessUrl)
          : false

      return (
        <NavItem
          key={resCode}
          label={resName}
          active={active}
          icon={iconUrl}
          activeIcon={iconBack ?? iconUrl}
          link={accessUrl}
          value={resCode}
          onClick={() => handleChange(item)}
        />
      )
    }

    return (
      <>
        {navResourceTree?.length > 0 && !inApp
          ? (
            <div className="fixed w-screen bottom-0 left-0 right-0 z-50 border-t min-h-[50px] flex justify-around items-center bg-white">
              {navResourceTree.map(renderItem)}
            </div>
          )
          : null}
      </>
    )
  },
)
