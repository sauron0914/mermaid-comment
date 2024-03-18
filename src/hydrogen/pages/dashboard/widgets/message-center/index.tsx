import { forwardRef, useImperativeHandle } from 'react'
import { href } from '@dian/app-utils/href'
import { useRouter } from '@dian/app-utils/router'
import { useToastQuery } from '@dian/common/hooks/react-query'
import { IconSVG } from '@/common/components/icon-svg'
import { fetchUnreadedMessages } from './api'

import type { MessageEntity } from './api'
import type { WidgetRef } from '../../types'

export const MessageCenter = forwardRef<WidgetRef>(function MessageCenter (_, ref) {
  const { navigator } = useRouter()

  const {
    data: unreadedMessagesResponse,
    refetch,
  } = useToastQuery<MessageEntity[], Error>({
    queryKey: ['fetchUnreadedMessages'],
    async queryFn () {
      const data = await fetchUnreadedMessages()
      return data
    },
  })

  const unreadedMessages = unreadedMessagesResponse ?? []

  const latestUnReadedMessages = unreadedMessages.slice(0, 3)

  // 未读消息数量汇总
  const totalMessageCount = unreadedMessages.length

  const fetchData = async () => {
    await refetch()
  }

  useImperativeHandle(ref, () => ({ fetchData }))

  return (
    <div className="rounded-lg bg-white p-3 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-base font-medium">消息中心</span>
        <span
          className="text-xs flex items-center"
          onClick={() => navigator.navigate('/messages/center')}
        >
          <span className="text-primary inline-block leading-3 h-3">更多消息{totalMessageCount > 0 && `（${totalMessageCount}）`}</span>
          <IconSVG symbol="icon-xianxing_you" className="text-[#B0B0B0] ml-1 w-4 h-4" />
        </span>
      </div>
      {
        latestUnReadedMessages.length > 0
          ? unreadedMessages.slice(0, 3).map((n, index) => (
            <div
              key={index}
              className="flex justify-between items-center"
              onClick={() => {
                href('global', n.actionUrl as `/${string}`)
              }}
            >
              <span className={`
                whitespace-nowrap
                rounded
                py-[2px]
                px-1
                text-xs
                ${index === 0 ? 'text-primary bg-[#E6FFEE]' : 'text-[#585858] bg-[#F8F8F8]'}
              `}
              >{n.businessType?.name?.substring(0, 2)}</span>
              <span className="inline-block bg-[#EFEFEF]  w-px h-[11px] scale-x-50 mx-2" />
              <span className="flex-1 truncate text-[#585858]">{n.content}</span>
              <IconSVG symbol="icon-xianxing_you" className="text-[#848484] ml-2 w-4 h-4" />
            </div>
          ))
          : (
            <div className="text-center">
              <img className="mx-auto" width={50} height={50} src="https://fed.dian.so/image/2d168d57b48c9e47f8949248616631b3.png" alt="" />
              <div className="text-[#848484] text-xs">暂无消息</div>
            </div>
          )
        }
    </div>
  )
})
