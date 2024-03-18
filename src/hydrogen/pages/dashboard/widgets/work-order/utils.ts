import { dayjs } from '@dian/app-utils'
import { DateTypeEnum } from './constants'

export const getStartDate = (type: DateTypeEnum, value: Date) => {
  if (type === DateTypeEnum.Day) {
    return dayjs(value).format('YYYYMMDD')
  } else if (type === DateTypeEnum.Week) {
    return dayjs(value).add(2, 'days')
      .startOf('week')
      .subtract(2, 'days')
      .format('YYYYMMDD')
  }
  return dayjs(value).startOf('month')
    .format('YYYYMMDD')
}
