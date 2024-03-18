import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Modal } from 'antd-mobile'
import { useQuery } from '@tanstack/react-query'
import { getLoginRole } from '@dian/app-utils/bridge'
import { IconSVG } from '@/common/components/icon-svg'
import { MiniTabs } from '@/common/components/mini-tabs'
import { getUserId } from '@/common/utils/cookie'
import {
  fetchAgentData,
  fetchChannelData,
  fetchDataConfig,
  fetchMCData,
} from './api'

import type { ChannelDataType } from './api'
import type { WidgetRef } from '../../types'

export const Today = forwardRef<WidgetRef>(function Today (props, ref) {
  const roleName = getLoginRole()
  const [currentTabContent, setCurrentTabContent] = useState<any>()

  const isAgentRole = roleName
    ? [
      'agencyBoss',
      'agencyBD',
      'agencyCooperativePartner',
      'op_agent_boss',
      'op_agent_bd',
      'AGENCY_BDM',
      'channel_mc',
      // 'agentSeller',
    ].includes(roleName)
    : false
  const isMCRole = roleName
    ? ['mcm', 'maintenance', 'OutWorkerMC', 'businessOC'].includes(roleName)
    : false

  const { data: config = [] } = useQuery({
    queryKey: ['fetchDataConfig'],
    async queryFn () {
      let role = 'channel'
      if (isAgentRole) {
        role = 'agent'
      } else if (isMCRole) {
        role = 'mc'
      }
      return await fetchDataConfig(role)
    },
  })

  const {
    data: mixedData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['fetchData', config],
    async queryFn () {
      if (isAgentRole) {
        // 获取代理商数据
        const data = (await fetchAgentData()) ?? {}
        const mixedData = config.map(({ title, key, columns }) => {
          const { [`${key}Data`]: tabData } = data
          return {
            title,
            key,
            columns: columns.map(n => ({
              ...n,
              value: tabData?.[n.name] ?? 0,
            })),
          }
        })
        return mixedData
      } else if (isMCRole) {
        // 获取MC数据
        const data =
          (await fetchMCData({
            mcId: getUserId(),
            datetime: 'current',
          })) ?? {}
        const mixedData = config.map(({ title, key, columns }) => {
          const { [`${key}`]: tabData } = data
          return {
            title,
            key,
            columns: columns.map(n => ({
              ...n,
              value: tabData?.[n.name] ?? 0,
            })),
          }
        })
        return mixedData
      }
      // 获取渠道商数据
      const allData = await Promise.all(
        config.map(({ key }) =>
          fetchChannelData(key as unknown as ChannelDataType)),
      )
      const mixedData = config.map(({ title, key, columns }, index) => {
        const tabData = allData[index]
        return {
          title,
          key,
          updateTime: tabData?.updateTime,
          columns: columns.map(n => ({
            ...n,
            value: tabData?.[n.name] ?? 0,
          })),
        }
      })
      return mixedData ?? config
    },
  })

  const handleTip = ({ tip }) => {
    Modal.alert({
      title: '提示',
      content: tip,
      confirmText: '我知道了',
    })
  }

  const handleTabChange = (currentTab) => {
    setCurrentTabContent(
      (mixedData ?? config).find(({ key }) => currentTab.key === key),
    )
  }

  const fetchData = async () => {
    await refetch()
  }

  useImperativeHandle(ref, () => ({ fetchData }))

  useEffect(() => {
    if (config.length > 0) {
      setCurrentTabContent(config[0])
    }
    if (mixedData) {
      setCurrentTabContent(mixedData.find(({ key }) => config[0].key === key))
    }
  }, [config, mixedData])

  return (
    <div className="rounded-lg bg-white p-3 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-base font-medium">
          数据
          {!!currentTabContent?.updateTime && (
            <span className="text-xs font-thin">
              更新时间：{currentTabContent.updateTime}
            </span>
          )}
        </span>
        <MiniTabs
          options={config.map(({ title, key }) => ({ title, key }))}
          onChange={handleTabChange}
        />
      </div>
      <div className="mt-1 flex flex-wrap">
        {isLoading
          ? (
            <>
              <div className="animate-pulse h-28 bg-gray-200 rounded w-full" />
            </>
          )
          : (
            currentTabContent?.columns.map((column, index) => (
              <div key={index} className="w-1/3 p-2 box-border ">
                <div className="flex justify-center items-center space-x-1">
                  <span className="text-[#585858] break-keep">
                    {column.label}
                  </span>
                  {column.tip && (
                    <IconSVG
                      className="text-[#585858] cursor-pointer"
                      symbol="icon-xianxing_bangzhu"
                      size={16}
                      onClick={() => handleTip(column)}
                    />
                  )}
                </div>
                <div className="mt-1 flex justify-center items-center space-x-2">
                  <span className="text-lg text-[1E1E1E]">
                    {column.value ?? 0}
                  </span>
                </div>
              </div>
            ))
          )}
      </div>
    </div>
  )
})
