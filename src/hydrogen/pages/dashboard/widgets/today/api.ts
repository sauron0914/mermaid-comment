import { dayjs, zApi } from '@dian/app-utils'

export enum ChannelDataType {
  'order',
  'device',
  'shop'
}

interface ConfigColumn {
  label: string
  name: string
  tip?: string
  url?: string
}

interface DataConfigType {
  title: string
  key: string
  columns: ConfigColumn[]
}

export const fetchDataConfig = (role: string) => {
  return zApi.get<DataConfigType[]>('/nile/api/v1/dashboard/nacos-config/today', { params: { role } })
}

// 获取代理商今日数据
export const fetchAgentData = () => {
  return zApi.tget<Record<string, any>>('/mch-sale/data/getToday', { data: {} })
}

// 获取渠道商今日数据
export const fetchChannelData = (type: ChannelDataType) => {
  return zApi.tget(`/agent/channel/index/${type}/outline`, {
    data: {
      timeType: 1,
      startTime: dayjs(Date.now()).format('YYYY-MM-DD'),
      endTime: dayjs(Date.now()).format('YYYY-MM-DD'),
    },
  })
}

// 获取MC 昨日/当月数据
export const fetchMCData = ({
  mcId,
  datetime,
}: {
  mcId: number
  datetime: string
}) => {
  return zApi.get(`/dms/mc/${mcId}/operation/indicator/all/${datetime}`)
}
