const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

function format (timestamp, formatStr) {
  const date = compatibleIosDate(timestamp)
  const year = date.getFullYear()
  const month = fillZero(date.getMonth() + 1)
  const day = fillZero(date.getDate())
  const hour = fillZero(date.getHours())
  const minute = fillZero(date.getMinutes())
  const second = fillZero(date.getSeconds())

  return formatStr
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

function formatToInterval (timestamp) {
  const now = Date.now()
  let value = now - timestamp
  value = value < 1 ? 1 : value

  if (value < MINUTE) {
    return `${Math.floor(value / SECOND)}秒前`
  }

  if (value < HOUR) {
    return `${Math.floor(value / MINUTE)}分钟前`
  }

  if (value < DAY) {
    return `${Math.floor(value / HOUR)}小时前`
  }

  return format(timestamp, 'MM月DD日')
}

function fillZero (value) {
  return value < 10 ? `0${value}` : value
}

function getDateStrByMonth (timestamp, addMonthCount) {
  const dd = compatibleIosDate(timestamp)
  dd.setMonth(dd.getMonth() + addMonthCount)
  const year = dd.getFullYear()
  const month = fillZero(dd.getMonth() + 1)
  const day = fillZero(dd.getDate())

  return `${year}-${month}-${day}`
}

function getNowMonthbefore (params) {
  const { flag, firstMonthName, monthNum, startFrom25 = true } = params
  const monthList = []
  const date = new Date()
  let addNum = 1
  const isNextMonth = startFrom25 && date.getDate() > 25
  if (startFrom25 && isNextMonth) {
    addNum = 2
    date.setDate(26) // 避免2月 month -1 没有30 31号
  }

  for (let i = 0; i < monthNum; i++) {
    let year = date.getFullYear()
    let month =
      date.getMonth() + addNum < 10
        ? `0${date.getMonth() + addNum}`
        : date.getMonth() + addNum
    const obj = {}
    if (month > 12) {
      year += 1
      month = `0${month - 12}`
    }
    obj.key = year + flag + month
    obj.value = year + flag + month
    monthList.push(obj)
    date.setMonth(date.getMonth() - 1)
  }
  monthList[0].key = firstMonthName

  return monthList
}

// 获取当前月有多少天
function getCountDays (timestamp) {
  const curDate = compatibleIosDate(timestamp)
  const curMonth = curDate.getMonth()
  curDate.setMonth(curMonth + 1)
  curDate.setDate(0)

  return curDate.getDate()
}

function compatibleIosDate (timestamp) {
  if (!timestamp) return new Date()

  if (typeof timestamp === 'number') return new Date(timestamp)

  const curTimestamp = String(timestamp || '')

  const arrLen = curTimestamp.split(/[./-]/).length

  // 如果只有年月，只支持 -
  if (arrLen === 2) {
    return new Date(curTimestamp.replace(/[/.]/g, '-'))
  }

  return new Date(curTimestamp.replace(/[-.]/g, '/'))
}

// 时分秒格式化 times: 时间戳秒数, flag: 分隔标志,如果是word就以时分秒的形式展示
// , isShowSecond: 是否展示秒
function hourFormat (times, flag, isShowSecond) {
  const time = times || 0
  let showTime = ''
  let hour = 0
  let minute = 0
  let second = 0
  if (!isShowSecond) {
    // 不带秒
    hour = Math.floor(time / 60 / 60)
    minute = parseInt((time / 60 / 60 - hour) * 60)
    if (flag === 'word') {
      showTime = `${hour}小时${minute}分`
    } else {
      showTime = hour + flag + minute
    }
  } else {
    // 带秒
    hour = Math.floor(time / 60 / 60)
    minute = parseInt((time / 60 / 60 - hour) * 60)
    second = Math.ceil(((time / 60 / 60 - hour) * 60 - minute) * 60)
    if (flag === 'word') {
      showTime = `${hour}小时${minute}分${second}秒`
    } else {
      showTime = hour + flag + minute + flag + second
    }
  }

  return showTime
}

export {
  format,
  compatibleIosDate,
  formatToInterval,
  getDateStrByMonth,
  getNowMonthbefore,
  getCountDays,
  hourFormat,
  fillZero,
}

export default {
  format,
  compatibleIosDate,
  formatToInterval,
  getDateStrByMonth,
  getNowMonthbefore,
  getCountDays,
  fillZero,
}
