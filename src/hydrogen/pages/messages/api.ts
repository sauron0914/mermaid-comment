import { zApi } from '@dian/app-utils'

export interface BizTypesMessageEntity {
  bizTypeName: string
  bizTypeCode: string
  unreadCount: number
  lastTime: string
  messageContent: string
  latestMessage: BizTypeMessageEntity
  iconName: string
}

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

export interface BizTypeMessageEntity {
  id: string
  subject: string
  content: string
  actionUrl: string
  creatorId: string
  createTime: string
  updateTime: string
  templateId: string
  sendType: number
  businessTypeId: string
  channels: ChannelEntity[]
  businessType: BusinessTypeEntity
}

export interface BizTypeMessageResponse {
  list: BizTypeMessageEntity[]
  current: number
  pageSize: number
  hasMore: boolean
  nextPage?: number
}

// 消息中心列表
export const fetchMessageCenterList = () => {
  return zApi.get<BizTypesMessageEntity[]>('/nile/api/v1/messages/biz-types')
}

// 业务类型消息列表
export const fetchMessageTypeList = (params: {
  bizTypeCode: string | undefined
  page: number
  pageSize: number
}) => {
  const { bizTypeCode, ...restParams } = params
  return zApi.get<BizTypeMessageResponse>(`/nile/api/v1/messages/biz-type/${bizTypeCode}`, { params: restParams })
}
