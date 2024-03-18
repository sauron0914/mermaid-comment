import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import dayjs from 'dayjs'
import { IconSVG } from '../../icon-svg'
import {
  monthData,
  weekData,
  getCurMonthAllDay,
  getDay,
  getPreMonthAllDays,
  getDayData,
  formatDate,
  formateMonthDay,
} from './date-picker-util'

type TypeSchema = {
  mode: string
  headerLabel: string
}
interface DatePickerDetailProps {
  label?: React.ReactNode
  value?: Date
  minDate?: Date
  maxDate?: Date
  performanceWeek?: boolean
  typeDetailSchema: TypeSchema
  onChange?: (date: Date) => void
  onSetLabel?: (checkedTime: string[]) => void
  customHeader: React.ReactNode | null
}

const DatePickerDetail: React.FC<DatePickerDetailProps> = (props) => {
  const {
    label,
    value,
    minDate = dayjs('1970-01-01').toDate(),
    maxDate = dayjs().toDate(),
    typeDetailSchema,
    performanceWeek,
    onChange,
    onSetLabel,
    customHeader,
  } = props

  const { year, month, day } = formatDate(value)
  const { year: minYear, month: minMonth, day: minDay } = formatDate(minDate)
  const { year: maxYear, month: maxMonth, day: maxDay } = formatDate(maxDate)

  const [iconStatus, setIconStatus] = useState(-1)
  const [curYear, setCurYear] = useState(year)
  const [curMonth, setCurMonth] = useState(month)
  const [curDay, setCurDay] = useState(day)
  const [visiable, setVisiable] = useState(false)
  const [pickerStyle, setPickerStyle] = useState({})
  const [checkedTime, setCheckedTime] = useState([''])

  const { mode, headerLabel } = typeDetailSchema

  // 检查当前日期是否超过最大时间
  const checkIsMoreThanMax = (year, month, day) => {
    if (
      year > maxYear ||
      (year === maxYear && month > maxMonth) ||
      (year === maxYear && month === maxMonth && day > maxDay)
    ) {
      return true
    }
    return false
  }

  // 检查当前日期是否小于最小时间
  const checkIsLessThanMin = (year, month, day) => {
    if (
      year < minYear ||
      (year === minYear && month < minMonth) ||
      (year === minYear && month === minMonth && day < minDay)
    ) {
      return true
    }
    return false
  }

  // 获取上一月的年份、月份
  const getPreMonth = (year, month) => {
    const resultYear = month === 1 ? year - 1 : year
    const resultMonth = month === 1 ? 12 : month - 1
    return [resultYear, resultMonth]
  }

  // 获取下一月的年份、月份
  const getNextMonth = (year, month) => {
    const resultYear = month === 12 ? year + 1 : year
    const resultMonth = month === 12 ? 1 : month + 1
    return [resultYear, resultMonth]
  }

  // 获取周选择时的日期范围
  const getWeekCheckTime = (year, month, item) => {
    const newCheckedTime: string[] = []
    const commonEdge = 6
    const itemValue = item.value
    const dayIndex = getDay(year, month, itemValue)
    const startIndex = dayIndex === 0 ? commonEdge + 1 : dayIndex

    let curItem = ''
    let newMonth = month
    let newYear = year
    let newDay = itemValue
    let curMonthAllDay = 0

    // 获取选择日期前的所有数据
    const getCheckBeforeTime = (start) => {
      let beaginValue = itemValue
      for (
        let beaginIndex = 0, index = 0;
        index < start;
        index++, beaginIndex++
      ) {
        newDay = beaginValue - beaginIndex
        if (!newDay) {
          [newYear, newMonth] = getPreMonth(newYear, newMonth)
          newDay = getCurMonthAllDay(newYear, newMonth)
          beaginIndex = 0
          beaginValue = newDay
        }
        if (checkIsLessThanMin(newYear, newMonth, newDay)) {
          break
        }
        curItem = `${newYear}-${newMonth}-${newDay}`
        newCheckedTime.unshift(curItem)
      }
    }

    // 获取选择日期后的所有数据
    const getCheckAfterTime = (edge) => {
      newMonth = month
      newYear = year
      newDay = itemValue
      for (let beaginIndex = 0; beaginIndex < edge - dayIndex; beaginIndex++) {
        newDay = newDay + 1
        curMonthAllDay = getCurMonthAllDay(newYear, newMonth)
        if (newDay > curMonthAllDay) {
          [newYear, newMonth] = getNextMonth(newYear, newMonth)
          newDay = 1
          curItem = `${newYear}-${newMonth}-${newDay}`
        } else if (newDay === curMonthAllDay) {
          curItem = `${newYear}-${newMonth}-${newDay}`
          const reuslt = getNextMonth(newYear, newMonth)
          newYear = reuslt[0]
          newMonth = reuslt[1]
          newDay = 0
        } else {
          curItem = `${newYear}-${newMonth}-${newDay}`
        }
        if (checkIsMoreThanMax(newYear, newMonth, newDay)) break
        newCheckedTime.push(curItem)
      }
    }

    // 获取普通周模式的时间范围
    const getCommonWeekCheckTime = () => {
      getCheckBeforeTime(startIndex)
      dayIndex && getCheckAfterTime(commonEdge + 1)
      return newCheckedTime
    }

    // 获取绩效周的时间范围
    const getPerformanceWeekCheckTime = () => {
      if (startIndex === 7) {
        for (let index = 0; index < commonEdge; index++) {
          curItem = `${newYear}-${newMonth}-${newDay}`
          newCheckedTime.push(curItem)
          curMonthAllDay = getCurMonthAllDay(newYear, newMonth)
          if (newDay === curMonthAllDay) {
            [newYear, newMonth] = getNextMonth(newYear, newMonth)
            newDay = 1
          } else {
            curItem = `${newYear}-${newMonth}-${newDay}`
            newDay = newDay + 1
          }
          if (checkIsMoreThanMax(newYear, newMonth, newDay)) {
            break
          }
        }
        const t = dayjs(newCheckedTime[0]).subtract(1, 'days')
        newCheckedTime.unshift(t.format('YYYY-M-D'))
      } else {
        const start = startIndex > 5 ? 5 - startIndex + 2 : startIndex + 2
        const end = startIndex > 5 ? startIndex + commonEdge : commonEdge - 1
        getCheckBeforeTime(start)
        getCheckAfterTime(end)
      }
      return newCheckedTime
    }

    return performanceWeek
      ? getPerformanceWeekCheckTime()
      : getCommonWeekCheckTime()
  }

  // 控制组件是否显示
  const handleTogglePicker = (status) => {
    const style = status
      ? { transform: 'translateY(0)' }
      : { transform: 'translateY(100%)' }
    setVisiable(status)
    setPickerStyle(style)
    setIconStatus(-1)
  }

  // 设置时间，触发父组件的onChange事件
  const handleClickChangeData = () => {
    const [year, month, day] = checkedTime[checkedTime.length - 1].split('-')
    const { formateMonth, formateDay } = formateMonthDay(
      parseInt(month),
      parseInt(day),
    )
    const date = dayjs(`${year}-${formateMonth}-${formateDay}`).toDate()
    onChange && onChange(date)
    mode === 'week' && onSetLabel && onSetLabel(checkedTime)
    handleTogglePicker(false)
  }

  // 选择天、周的日期
  const handleCheckDay = (
    year,
    month,
    item,
    isSetLabel = false,
    isNeedCheck = false,
  ) => {
    if (
      isNeedCheck &&
      (checkIsMoreThanMax(year, month, item.value) ||
        checkIsLessThanMin(year, month, item.value))
    ) {
      return
    }
    if (mode === 'week') {
      const time = getWeekCheckTime(year, month, item)
      setCheckedTime(time)
      isSetLabel && onSetLabel && onSetLabel(time)
    } else if (mode === 'day') {
      setCheckedTime([`${year}-${month}-${item.value}`])
    } else {
      const curMonthAllDay = getCurMonthAllDay(year, month)
      setCheckedTime([`${year}-${month}-${curMonthAllDay}`])
    }
  }

  // 选择月的日期
  const handleClickMonthTime = (item, isDisabled) => {
    if (isDisabled) return
    const curMonthAllDay = getCurMonthAllDay(curYear, item)
    setCheckedTime([`${curYear}-${item}-${curMonthAllDay}`])
  }

  useEffect(() => {
    const { year, month, day } = formatDate(value)
    const item = { value: day }
    setCurDay(day)
    setCurMonth(month)
    setCurYear(year)
    handleCheckDay(year, month, item, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, value])

  // 月模式
  const monthEle = useMemo(() => {
    let disabledNextCount = -1
    let disabledPreCount = -1
    if (curYear === maxYear) {
      disabledNextCount = maxDate ? maxDate.getMonth() : -1
    }
    if (curYear === minYear) {
      disabledPreCount = minDate ? minDate.getMonth() : -1
    }

    const getItemlass = (isDisabled, item) => {
      const classNames: string[] = ['item-detail']
      const curMonthAllDay = getCurMonthAllDay(curYear, item)
      isDisabled && classNames.push('disabled')
      checkedTime.includes(`${curYear}-${item}-${curMonthAllDay}`) &&
        classNames.push('active')
      return [...classNames]
    }

    return monthData().map((m, i) => {
      const isDabledNextCount = disabledNextCount > -1 && i > disabledNextCount
      const isDisabledPreCount = disabledPreCount > -1 && i < disabledPreCount
      const isDisabled = isDabledNextCount || isDisabledPreCount

      return (
        <div className="item" key={m.key}>
          <div
            className={classnames(getItemlass(isDisabled, m.value))}
            onClick={() => handleClickMonthTime(`${m.value}`, isDisabled)}
          >
            <span>{m.name}</span>
          </div>
        </div>
      )
    })
  }, [maxDate, minDate, maxYear, minYear, curYear, curDay, checkedTime])

  // 周以及天模式
  const dayEle = useMemo(() => {
    const curentDayDada = getDayData(curYear, curMonth)
    const currentDayEle = curentDayDada.map((m) => {
      const curItem = `${curYear}-${curMonth}-${m.value}`
      const isItemChecked = checkedTime.includes(curItem)
      const isStartChecked = checkedTime.indexOf(curItem) === 0
      const isEndChecked =
        checkedTime.indexOf(curItem) === checkedTime.length - 1
      const isActive = isStartChecked || isEndChecked
      const isWeekMode = mode === 'week'

      const getItemDetailClass = (item) => {
        const itemDetailClass = ['item-detail', 'item-day-detail']
        if (!isWeekMode) {
          isEndChecked && itemDetailClass.push('item-week-active')
          isActive && itemDetailClass.push('active')
        }
        if (
          checkIsMoreThanMax(curYear, curMonth, item.value) ||
          checkIsLessThanMin(curYear, curMonth, item.value)
        ) {
          itemDetailClass.push('disabled')
        }
        isItemChecked && itemDetailClass.push('setion-active')
        return [...itemDetailClass]
      }

      const spanEle = (
        <>
          <span
            className={classnames({ 'special-text': isWeekMode && isActive })}
          >
            {m.name}
          </span>
          {mode === 'week' && isActive && (
            <p>
              {isStartChecked && checkedTime.length !== 1 ? '开始' : '结束'}
            </p>
          )}
        </>
      )

      return (
        <div
          className="item"
          key={m.key}
          onClick={() => handleCheckDay(curYear, curMonth, m, false, true)}
        >
          <div className={classnames(getItemDetailClass(m))}>
            {isActive && isWeekMode
              ? (
                <div
                  className={classnames({ active: isActive }, 'item-wrap-detail')}
                >
                  {spanEle}
                </div>
              )
              : (
                spanEle
              )}
          </div>
        </div>
      )
    })

    const firstDay = getDay(curYear, curMonth, 1)
    const lastDay = getDay(
      curYear,
      curMonth,
      getCurMonthAllDay(curYear, curMonth),
    )
    const preAllDays = getPreMonthAllDays(curYear, curMonth)

    for (let i = 0; i < firstDay; i++) {
      currentDayEle.unshift(
        <div className="item" key={`pre${i}`}>
          <div className="item-detail item-day-detail disabled">
            <span>{preAllDays - i}</span>
          </div>
        </div>,
      )
    }

    for (let i = lastDay, j = 1; i < 6; i++, j++) {
      currentDayEle.push(
        <div className="item" key={`next${i}`}>
          <div className="item-detail item-day-detail disabled">
            <span>{j}</span>
          </div>
        </div>,
      )
    }

    return currentDayEle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curYear, curMonth, curDay, checkedTime, mode])

  // 日、周模式下的头部元素
  const weekHeaderEle = useMemo(() => {
    return mode !== 'month'
      ? weekData.map((m) => {
        return (
          <div className="item" key={m.key}>
            <div className="item-detail">
              <span>{m.name}</span>
            </div>
          </div>
        )
      })
      : null
  }, [mode])

  // 左右切换选择
  const handleClickIcon = (type) => {
    let newYear = 0
    let newMonth = curMonth
    if (mode !== 'month') {
      if (type === 1) {
        [newYear, newMonth] = getPreMonth(curYear, curMonth)
      } else {
        [newYear, newMonth] = getNextMonth(curYear, curMonth)
      }
      if (
        newYear > maxYear ||
        (newYear === maxYear && newMonth > maxMonth) ||
        newYear < minYear ||
        (newYear === minYear && newMonth < minMonth)
      ) {
        return
      }
    } else {
      newYear = type === 1 ? curYear - 1 : curYear + 1
      if (newYear > maxYear || newYear < minYear) {
        return
      }
    }
    setIconStatus(type)
    setCurYear(newYear)
    setCurMonth(newMonth)
  }

  const pickerEle = useMemo(() => {
    return (
      <div className="dian-date-picker" style={pickerStyle}>
        {
          customHeader || (
            <div className="picker-header-text">
              <div className="date-picker-content">
                <span>{headerLabel}</span>
                <span onClick={() => handleTogglePicker(false)}>
                  <IconSVG symbol="icon-xianxing_guanbi" size={18} />
                </span>
              </div>
            </div>
          )
        }
        <div className="picker-header-operation">
          <div className="date-picker-content">
            <div
              className={classnames('operation', { active: iconStatus === 1 })}
              onClick={() => handleClickIcon(1)}
            >
              <IconSVG symbol="icon-xianxing_zuo" size={18} className="icon" />
            </div>
            <div className="year-name">
              <span>
                {curYear}年{mode !== 'month' ? `${curMonth}月` : ''}
              </span>
            </div>
            <div
              className={classnames('operation', { active: iconStatus === 2 })}
              onClick={() => handleClickIcon(2)}
            >
              <IconSVG symbol="icon-xianxing_you" size={18} className="icon" />
            </div>
          </div>
        </div>
        <div
          className={classnames('picker-detail-wrap', mode, {
            'picker-detail-week': !performanceWeek,
          })}
        >
          <div className="date-picker-content">
            {weekHeaderEle}
            {mode !== 'month' ? dayEle : monthEle}
          </div>
        </div>
        <div className="picker-btn">
          <button onClick={handleClickChangeData}>确定</button>
        </div>
      </div>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dayEle,
    monthEle,
    iconStatus,
    curYear,
    curMonth,
    pickerStyle,
    headerLabel,
    performanceWeek,
    weekHeaderEle,
    mode,
  ])

  const maskEle = useMemo(() => {
    return (
      <div
        className={classnames('dian-picker-mask', { hide: !visiable })}
        onClick={() => handleTogglePicker(false)}
      />
    )
  }, [visiable])

  return (
    <div className="date-picker-wrap">
      <span onClick={() => handleTogglePicker(true)}>{label}</span>
      {ReactDOM.createPortal(pickerEle, window.document.body)}
      {ReactDOM.createPortal(maskEle, window.document.body)}
    </div>
  )
}

export default DatePickerDetail
