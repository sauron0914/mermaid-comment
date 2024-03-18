import type { MutableRefObject, PropsWithChildren } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker'
import type { Precision } from 'antd-mobile/es/components/date-picker/date-picker-utils'
import type { FormControllerProps } from './controller'
import type { DatePickerProps } from 'antd-mobile'

import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { DatePicker } from 'antd-mobile'
import { pick, omit, without } from 'lodash'
import { dayjs } from '@dian/app-utils'
import { controllerPropKeys, FormController } from './controller'
import { IconSVG } from './../icon-svg'

type DatePickerFieldProps<T extends FieldValues> = Omit<FormControllerProps<T>, 'render'>
  & Omit<DatePickerProps, 'onClick' | 'visible'>
  & {
    placeholder?: string
    formatTemplate?: string
    renderFormat?: (value: dayjs.Dayjs) => string
    valueFormat?: (value: dayjs.Dayjs) => string
    onChange?: (value: dayjs.Dayjs, methods: UseFormReturn<FieldValues>) => void
    labelWithUnit?: boolean
  }

const weekdayToZh = (weekday: number) => {
  switch (weekday) {
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
    case 7:
      return '周日'
    default:
      return weekday
  }
}

export const DatePickerField = <
  T extends FieldValues = FieldValues,
>(props: PropsWithChildren<DatePickerFieldProps<T>>) => {
  const controllerProps = pick(props, without(controllerPropKeys, 'onClick'))
  const datePickerProps = omit(props, [...controllerPropKeys, 'placeholder', 'renderLabel'])
  const {
    placeholder = '请选择',
    labelWithUnit = false,
    formatTemplate = 'YYYY-MM-DD',
    renderLabel,
    onClick,
  } = props

  const methods = useFormContext()

  // 自定义渲染日期单位
  const labelRenderer = useCallback((type: Precision, data: number) => {
    switch (type) {
      case 'year':
        return `${data}年`
      case 'month':
        return `${data}月`
      case 'day':
        return `${data}日`
      case 'hour':
        return `${data}时`
      case 'minute':
        return `${data}分`
      case 'second':
        return `${data}秒`
      case 'week':
        return `${data}周`
      case 'week-day':
        return weekdayToZh(data)

      default:
        return data
    }
  }, [])

  const valueFormat = (value) => {
    return props.valueFormat ? props.valueFormat(dayjs(value)) : dayjs(value).format(formatTemplate)
  }

  const renderFormat = (value) => {
    return props.renderFormat ? props.renderFormat(dayjs(value)) : dayjs(value).format(formatTemplate)
  }

  return (
    <FormController<T, DatePickerRef>
      onClick={(e, ref) => {
        ref?.current.open()
        onClick?.(e, ref as unknown as MutableRefObject<void>)
      }}
      {...controllerProps}
      render={({
        onChange,
        value,
        ...restField
      }) => (
        <DatePicker
          onConfirm={(value) => {
            onChange(valueFormat(value))
            methods.trigger(props.name)
            props.onChange?.(dayjs(value), methods)
          }}
          renderLabel={labelWithUnit ? labelRenderer : renderLabel}
          value={value ? dayjs(value).toDate() : null}
          {...datePickerProps}
          {...restField}
        >
          {(value) => {
            return (
              <div className="flex justify-between text-base">
                {
                value
                  ? renderFormat(value)
                  : <span className="text-[#B0B0B0]">{placeholder}</span>
              }
                <IconSVG symbol="icon-xianxing_you" />
              </div>
            )
          }}
        </DatePicker>
      )}
    />
  )
}
