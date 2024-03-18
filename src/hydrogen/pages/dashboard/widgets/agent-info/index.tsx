import { forwardRef, useImperativeHandle } from 'react'
import { useUserInfo } from './api'
import { NoticeBar, Tag } from 'antd-mobile'
import type { WidgetRef } from '../../types'
import { useAgentStatus } from '../../api'

export const AgentInfo = forwardRef<WidgetRef>(function Tools (_, ref) {
  const { data, refetch } = useUserInfo()
  const { data: agentStatus } = useAgentStatus()

  const fetchData = async () => {
    await refetch()
  }
  useImperativeHandle(ref, () => ({ fetchData }))

  if (!data) {
    return null
  }

  return (
    <div className="relative p-2 bg-white rounded">
      <div className="font-bold mb-2 text-base pr-16 line-clamp-2">
        {data.nickName}
      </div>

      <div className="flex gap-1">
        {data.agentId && (
          <Tag round color="#C0AB89" fill="outline">
            代理商ID:{data.agentId}
          </Tag>
        )}
        {data.userId && (
          <Tag round color="#C0AB89" fill="outline">
            员工ID:{data.userId}
          </Tag>
        )}
        {data.level && (
          <Tag round color="#C0AB89" fill="outline">
            {data.level}
          </Tag>
        )}
      </div>
      {!!agentStatus?.isBindContract && agentStatus?.needCharge && (
        <NoticeBar
          className="mt-2"
          style={{
            '--font-size': '12px',
            '--height': '30px',
          }}
          content="请点击“代理费充值”入口并进行充值后，才可使用全部功能。"
          color="alert"
        />
      )}
    </div>
  )
})
