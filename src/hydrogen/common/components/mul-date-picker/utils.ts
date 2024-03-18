import dayjs from 'dayjs'
import { DateTypeEnum } from './props-type'
import { PERFORMANCE_WEEK_OFFSET } from './static'

export const getT0DefaultEndDate = (): Date => {
  // T+0模式下最后一天都是到今天
  return dayjs().startOf('day')
    .toDate()
}

export const getT1DefaultEndDate = (
  type: DateTypeEnum,
  performanceWeek?: boolean,
): Date => {
  const value = dayjs()
  if (type === DateTypeEnum.Week) {
    if (performanceWeek) {
      // 绩效周从周六开始，所以所有日期加2天才是自然周
      return value
        .add(PERFORMANCE_WEEK_OFFSET, 'days')
        .startOf('isoWeek')
        .subtract(PERFORMANCE_WEEK_OFFSET + 1, 'days')
        .toDate()
    }
    return value.startOf('isoWeek').subtract(1, 'days')
      .toDate()
  } else if (type === DateTypeEnum.Month) {
    // 月纬度T+1数据到昨天
    return value.subtract(1, 'days').toDate()
  }
  return dayjs().subtract(1, 'days')
    .startOf('day')
    .toDate()
}
