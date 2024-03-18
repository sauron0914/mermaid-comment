import type React from 'react'
import { useMemo } from 'react'
import classnames from 'classnames'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

import { IconSVG } from '../icon-svg'
import DateTypeSelect from './date-type-select'
import DatePickerDetail from './date-picker-detail'

import type { T1PickerProp } from './props-type'
import { DateTypeEnum } from './props-type'
import { PERFORMANCE_WEEK_OFFSET, typeDetailSchema } from './static'
import { getT1DefaultEndDate } from './utils'

import './new-style.less'

// 理论上value是当期最后一天，实际value可能是周/月随机某一天
const useStartDate = (
  value: Dayjs,
  type: DateTypeEnum,
  performanceWeek?: boolean,
) => {
  return useMemo(() => {
    if (type === DateTypeEnum.Week) {
      if (performanceWeek) {
        // 绩效周从周六开始，所以所有日期加2天才是自然周
        return value
          .add(PERFORMANCE_WEEK_OFFSET, 'days')
          .startOf('isoWeek')
          .subtract(PERFORMANCE_WEEK_OFFSET, 'days')
      }
      return value.startOf('isoWeek')
    } else if (type === DateTypeEnum.Month) {
      return value.startOf('month')
    }
    return value
  }, [performanceWeek, type, value])
}

const useEndDate = (type: DateTypeEnum, startDate: Dayjs) => {
  return useMemo(() => {
    if (type === DateTypeEnum.Week) {
      return startDate.add(6, 'days')
    } else if (type === DateTypeEnum.Month) {
      // 如果后期有绩效月的加入，这里要改逻辑
      let date = startDate.endOf('month')
      const defaultEndDate = dayjs(getT1DefaultEndDate(type))
      if (date.format('YYYYMMDD') > defaultEndDate.format('YYYYMMDD')) {
        date = defaultEndDate
      }
      return date
    }
    return startDate
  }, [startDate, type])
}

const useMaxDate = (
  type: DateTypeEnum,
  performanceWeek: boolean,
  defaultMaxDate?: Dayjs,
) => {
  return useMemo(() => {
    if (defaultMaxDate) {
      return defaultMaxDate
    }
    return dayjs(getT1DefaultEndDate(type, performanceWeek))
  }, [defaultMaxDate, performanceWeek, type])
}

const useDateLabel = (startDate: Dayjs, type: DateTypeEnum, dateTypeSelectInPicker?: boolean) => {
  return useMemo(() => {
    let label: React.ReactNode = (dateTypeSelectInPicker ? '按日' : '') + startDate.format('YYYY-MM-DD')
    if (type === DateTypeEnum.Month) {
      label = (dateTypeSelectInPicker ? '按月' : '') + startDate.format('YYYY-MM月')
    } else if (type === DateTypeEnum.Week) {
      label = (
        <div className="week-label">
          {dateTypeSelectInPicker ? '按周' : ''}
          <div>{startDate.format('YYYY/MM/DD')}</div>
          <div>~</div>
          <div>{startDate.add(6, 'days').format('YYYY/MM/DD')}</div>
        </div>
      )
    }
    return <div className="picker-label">{label}</div>
  }, [dateTypeSelectInPicker, startDate, type])
}

const useDisabled = (endDate: Dayjs, maxDate: Dayjs) => {
  return useMemo(() => {
    // 之所以用字符串判断，是因为日期单位是日
    // 如果需要通过valueOf安全的判断逻辑，就必须写成t.formate('YYYYMMDD').toDate().valueOf()再进行对比
    // 因为字符串比较是逐个对比每个字符ascll码，所以长度相同纯数字的字符串是可以直接对比大小的
    return endDate.format('YYYYMMDD') >= maxDate.format('YYYYMMDD')
  }, [endDate, maxDate])
}

// 传入的value和onchange返回的value都是周/月的最后一天。因为绩效周的问题，所以会出现值不一定是周末的情况
export const MulDatePicker: React.FC<T1PickerProp> = (props) => {
  const { value, type, minDate, onlyMonth, performanceWeek, onChange, dateTypeSelectInPicker } = props
  const startDate = useStartDate(value, type, performanceWeek)
  const endDate = useEndDate(type, startDate)
  const maxDate = useMaxDate(type, performanceWeek, props.maxDate)
  const dateLabel = useDateLabel(startDate, type, dateTypeSelectInPicker)
  const disabled = useDisabled(endDate, maxDate)

  const onClickPre = () => {
    const preDate = startDate.subtract(1, 'days')
    onChange(type, preDate)
  }

  const onClickNext = () => {
    if (disabled) {
      return
    }
    let nextDate = endDate.add(1, 'days')
    if (type === DateTypeEnum.Week) {
      nextDate = endDate.add(7, 'days')
    } else if (type === DateTypeEnum.Month) {
      nextDate = endDate.add(1, 'months')
    }
    if (nextDate.format('YYYYMMDD') > maxDate.format('YYYYMMDD')) {
      nextDate = maxDate
    }

    onChange(type, nextDate)
  }

  const onTypeChange = (type) => {
    const nextDate = getT1DefaultEndDate(type, performanceWeek)
    onChange(type, dayjs(nextDate))
  }

  const onSelect = (value) => {
    onChange(type, dayjs(value))
  }

  const nextClassname = useMemo(
    () => classnames('icon-next', { disabled }),
    [disabled],
  )
  const theMinDate = useMemo(() => minDate?.toDate(), [minDate])
  const theMaxDate = useMemo(() => maxDate?.toDate(), [maxDate])
  const theValue = useMemo(() => endDate.toDate(), [endDate])

  return (
    <div className="dm-mul-date-picker">
      {
        !dateTypeSelectInPicker && (
          <DateTypeSelect
            type={type}
            onlyMonth={!!onlyMonth}
            onChange={onTypeChange}
          />
        )
      }
      <div className="icon-and-label">
        <IconSVG
          size={20}
          symbol="icon-paixu"
          className="icon-pre"
          onClick={onClickPre}
        />
        <DatePickerDetail
          onChange={onSelect}
          onSetLabel={() => undefined}
          minDate={theMinDate}
          maxDate={theMaxDate}
          value={theValue}
          label={dateLabel}
          typeDetailSchema={typeDetailSchema[type]}
          performanceWeek={props.performanceWeek}
          customHeader={
            dateTypeSelectInPicker
              ? (
                <DateTypeSelect
                  type={type}
                  onlyMonth={!!onlyMonth}
                  onChange={onTypeChange}
                  dateTypeSelectInPicker
                />
              )
              : null
          }
        />
        <IconSVG
          size={20}
          symbol="icon-paixu"
          className={nextClassname}
          onClick={onClickNext}
        />
      </div>
    </div>
  )
}

export default MulDatePicker
