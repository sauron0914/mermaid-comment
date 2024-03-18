import { useEffect, useState } from 'react'
import { Badge, NoticeBar } from 'antd-mobile'
import { dayjs } from '@dian/app-utils'
import { useRouter } from '@dian/app-utils/router'
import { openURL, call as bridgeCall } from '@dian/bridge'
import { useToastQuery } from '@dian/common/hooks/react-query'
import Error from '@dian/common/components/error'
import { Loading } from '@/common/components/loading'
import { IconSVG } from '@/common/components/icon-svg'
import Empty, { EmptyType } from '@/common/components/empty'

import { fetchMessageCenterList } from './api'
import type { BizTypesMessageEntity } from './api'

const MessageCenter = () => {
  const { navigator } = useRouter()
  const [appNotificationStatus, setAppNotificationStatus] = useState(false)
  const [bridgeHasAppNotificationStatus, setBridgeHasAppNotificationStatus] = useState(false)

  const { data: bizTypesMessageResponse, isLoading, error } = useToastQuery<BizTypesMessageEntity[], Error>({
    queryKey: ['fetchMessageCenterList'],
    async queryFn () {
      const data = await fetchMessageCenterList()
      return data
    },
  })

  const typeMessages = bizTypesMessageResponse ?? []

  const openNativeNotification = () => {
    // app跳转到系统消息通知设置界面
    openURL({
      url: 'app-settings:notification',
    })
  }

  const navigateToMessageList = (message: BizTypesMessageEntity) => {
    navigator.navigate(`/messages/${message.bizTypeCode}?title=${message.bizTypeName}`)
  }

  // 进入页面，判断app是否有开启通知提醒状态的api
  // 有的话，获取app是否开启通知提醒的状态
  // 没有的话，不展示开启通知提醒
  useEffect(() => {
    bridgeCall('getNotificationStatus', {})
      .then((res: any) => {
        setBridgeHasAppNotificationStatus(true)
        if (res.success) {
          const { enable } = res.data
          setAppNotificationStatus(enable)
        }
      })
      .catch(() => {
        setBridgeHasAppNotificationStatus(false)
      })
  }, [])

  if (isLoading) return <Loading className="h-screen items-center" />
  if (error) return <Error text={error?.message} />

  return (
    <div className="bg-[#F5F5F5] h-full min-h-screen">
      {
        bridgeHasAppNotificationStatus && !appNotificationStatus && (
          <NoticeBar
            content={(
              <div>为避免错过重要消息，请点击
                <a
                  className="font-bold text-orange-500 underline"
                  onClick={openNativeNotification}
                >开启通知提醒</a>
              </div>
              )}
            color="alert"
            closeable
          />
        )
      }
      <div className="p-2 text-gray-500 text-xs">
        共 <span className="text-orange-500">{typeMessages.reduce((prev, next) => prev + next.unreadCount, 0)}</span> 条未读消息
      </div>
      {
        typeMessages.length > 0
          ? typeMessages.map((message, index) => (
            <div
              key={index}
              className="flex bg-white "
              onClick={() => navigateToMessageList(message)}
            >
              <Badge content={message.unreadCount !== 0 ? message.unreadCount > 99 ? '99+' : message.unreadCount : null} style={{ '--right': '18px', '--top': '18px' }}>
                <IconSVG symbol={message.iconName} className="w-[52px] h-[52px] box-content p-3" />
              </Badge>
              <div className={`flex flex-col justify-around py-3 pr-3 basis-full min-w-0 ${index === typeMessages.length - 1 ? 'border-0' : 'border-b'} border-slate-200 border-solid`}>
                <div className="flex justify-between">
                  <div className="text-base font-medium mb-1">{message.bizTypeName}</div>
                  <div className="text-xs text-[#848484]">{dayjs(Number(message.lastTime)).format('HH:mm')}</div>
                </div>
                <div className="truncate text-xs max-w-full text-[#848484]">{message.latestMessage.content}</div>
              </div>
            </div>
          ))
          : (
            <div className="h-[calc(100vh_-_4.5rem)] flex flex-col justify-center">
              <Empty type={EmptyType.NoData} text="暂无消息" />
            </div>
          )

      }
    </div>
  )
}

export default MessageCenter
