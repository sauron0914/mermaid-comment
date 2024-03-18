import dayjs from 'dayjs'

// 初始化周的数据
export const weekData = [
  { name: '日', key: 0 },
  { name: '一', key: 1 },
  { name: '二', key: 2 },
  { name: '三', key: 3 },
  { name: '四', key: 4 },
  { name: '五', key: 5 },
  { name: '六', key: 6 },
]

// 对月、天进行补0
export function formateMonthDay (month, day) {
  return {
    formateMonth: month < 10 ? `0${month}` : month,
    formateDay: day < 10 ? `0${day}` : `${day}`,
  }
}

// 初始化月的数据
export function monthData () {
  return Array.from({ length: 12 }, (_, index) => {
    return {
      name: `${index + 1}月`,
      key: `${index + 1}`,
      value: index + 1,
    }
  })
}

// 获取当前月有多少天
export function getCurMonthAllDay (
  year = dayjs().get('year'),
  month = dayjs().get('month') + 1,
) {
  const curDate = new Date(year, month, 0)
  return curDate.getDate()
}

// 获取上月有多少天
export function getPreMonthAllDays (year, month) {
  const { formateMonth, formateDay } = formateMonthDay(month, 1)
  const preMonth = dayjs(`${year}-${formateMonth}-${formateDay}`).subtract(
    1,
    'months',
  )
  const preDays = getCurMonthAllDay(
    preMonth.get('year'),
    preMonth.get('month') + 1,
  )
  return preDays
}

// 初始化周的数据
export function getDayData (
  year = dayjs().get('year'),
  month = dayjs().get('month') + 1,
) {
  return Array.from({ length: getCurMonthAllDay(year, month) }, (_, index) => {
    const { formateMonth, formateDay } = formateMonthDay(month, index + 1)
    return {
      name: `${index + 1}`,
      key: `${index + 1}`,
      value: index + 1,
      index: dayjs(`${year}-${formateMonth}-${formateDay}`).get('day'),
    }
  })
}

// 获取指定某月指定号数是星期几
export function getDay (year, month, day) {
  const { formateMonth, formateDay } = formateMonthDay(month, day)
  return dayjs(`${year}-${formateMonth}-${formateDay}`).get('day')
}

// 格式化传入的日期
export function formatDate (dateObj) {
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  return {
    year: year,
    month: month,
    day: day,
  }
}
