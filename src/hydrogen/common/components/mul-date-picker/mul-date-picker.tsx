import type React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import IsoWeek from 'dayjs/plugin/isoWeek'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import type { MulDatePickerProp } from './props-type'
import { DateTypeEnum, TModeEnum } from './props-type'
import { getT0DefaultEndDate, getT1DefaultEndDate } from './utils'

import T1Picker from './t1-picker'
import T0Picker from './t0-picker'
import './new-style.less'
import './index.less'

dayjs.extend(advancedFormat)
dayjs.extend(IsoWeek)

const MulDatePicker = (props: MulDatePickerProp): React.ReactElement => {
  const { mode, type, defaultType, onlyMonth, performanceWeek, dateTypeSelectInPicker } = props

  const dateValue = useMemo(() => {
    const date = props.value || props.defaultValue
    return date ? dayjs(date) : dayjs()
  }, [props.value, props.defaultValue])

  const dateType: DateTypeEnum = useMemo(() => {
    return type || defaultType || DateTypeEnum.Day
  }, [type, defaultType])

  const [endDate, setEndDate] = useState<Dayjs>(dateValue)
  const [privateType, setPrivateType] = useState(dateType)

  const maxDate = useMemo(() => {
    return props.maxDate && dayjs(props.maxDate)
  }, [props.maxDate])

  const minDate = useMemo(() => {
    // 公司2017年成立的
    return dayjs(props.minDate || '2017/01/01')
  }, [props.minDate])

  useEffect(() => {
    if (dateValue.format('YYYY-MM-DD') !== endDate.format('YYYY-MM-DD')) {
      setEndDate(dateValue)
    }
  }, [dateValue, endDate])

  useEffect(() => {
    setPrivateType(privateType)
  }, [dateType, privateType])

  const onChange = useCallback((type, endDate: Dayjs) => {
    setEndDate(endDate)
    setPrivateType(type)
    props.onChange && props.onChange(type, endDate.toDate())
  }, [props])

  return useMemo(() => {
    const props = {
      value: endDate,
      type: onlyMonth ? DateTypeEnum.Month : privateType,
      minDate: minDate,
      maxDate: maxDate,
      onlyMonth: onlyMonth,
      performanceWeek: performanceWeek || false,
      onChange: onChange,
      dateTypeSelectInPicker,
    }
    if (mode === TModeEnum.T0) {
      return <T0Picker {...props} />
    }
    return <T1Picker {...props} />
  }, [endDate, onlyMonth, privateType, minDate, maxDate, performanceWeek, onChange, dateTypeSelectInPicker, mode])
}

MulDatePicker.getT0DefaultEndDate = getT0DefaultEndDate
MulDatePicker.getT1DefaultEndDate = getT1DefaultEndDate

export default MulDatePicker
