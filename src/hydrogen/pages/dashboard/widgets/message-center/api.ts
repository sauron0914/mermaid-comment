import { zApi } from '@dian/app-utils'

interface ChannelEntity {
  id?: string
  name?: string
  code?: string
}

interface BusinessTypeEntity {
  id?: string
  name?: string
  code?: string
  iconName?: string
}

export interface MessageEntity {
  id?: string
  subject?: string
  content?: string
  actionUrl?: string
  creatorId?: string
  createTime?: string
  updateTime?: string
  templateId?: string
  sendType?: number
  businessTypeId?: string
  channels?: ChannelEntity[]
  businessType?: BusinessTypeEntity
}

export const fetchUnreadedMessages = () => {
  return zApi.get<MessageEntity[]>('/nile/api/v1/messages/unreaded')
}
