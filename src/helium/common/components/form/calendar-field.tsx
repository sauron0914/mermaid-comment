import type { PropsWithChildren } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { CalendarProps } from 'antd-mobile'
import type { FormControllerProps } from './controller'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { pick, omit } from 'lodash'
import { Popup, Calendar } from 'antd-mobile'
import { dayjs } from '@dian/app-utils'

import { IconSVG } from '../../components/icon-svg'
import { controllerPropKeys, FormController } from './controller'

type CalendarValue = Date | [Date, Date] | null | undefined

type CalendarFieldProps<T extends FieldValues> = Omit<FormControllerProps<T>, 'render'>
  & CalendarProps
  & {
    placeholder?: string
    cancelText?: string
    confirmText?: string
    title?: string
    separator?: string
    onCancel?: () => void
    onConfirm?: (value: CalendarValue, closeCallback: () => void) => void
  }

export const CalendarField = <
  T extends FieldValues = FieldValues,
>(props: PropsWithChildren<CalendarFieldProps<T>>) => {
  const controllerProps = pick(props, controllerPropKeys)
  const fieldPropsKeys = ['placeholder', 'cancelText', 'confirmText', 'title', 'onCancel', 'onConfirm']
  const calendarProps = omit(props, [...controllerPropKeys, ...fieldPropsKeys])
  const methods = useFormContext()

  const {
    placeholder = '请选择',
    title,
    cancelText = '取消',
    confirmText = '确定',
    separator = ' - ',
  } = props

  const fieldValue = methods.getValues(props.name)
  const [visible, setVisible] = useState<boolean>(false)
  const [selectedValue, setSelectedValue] = useState<CalendarValue>(fieldValue)

  return (
    <FormController
      onClick={() => {
        setVisible(true)
      }}
      {...controllerProps}
      render={({
        onChange,
        value,
      }) => {
        return (
          <>
            <div className="flex justify-between text-base">
              {
                value
                  ? Array.isArray(value)
                    ? value.map(date => dayjs(date).format('YYYY-MM-DD')).join(separator)
                    : dayjs(value).format('YYYY-MM-DD')
                  : <span className="text-[#B0B0B0]">{placeholder}</span>
              }
              <IconSVG className="shrink-0" symbol="icon-xianxing_you" />
            </div>
            <Popup
              bodyClassName="rounded-t-lg"
              position="bottom"
              closeOnMaskClick
              destroyOnClose
              visible={visible}
              onClose={() => {
                setVisible(false)
              }}
            >
              <div className="flex justify-between items-center p-1 border-b border-[#eee]">
                <a
                  className="inline-block p-2"
                  role="button"
                  onClick={() => {
                    props.onCancel?.()
                    setVisible(false)
                  }}
                >{cancelText}</a>
                <div className="flex-1 text-center">{title}</div>
                <a
                  className="inline-block p-2"
                  role="button"
                  onClick={() => {
                    onChange(selectedValue)
                    props.onConfirm ? props.onConfirm?.(selectedValue, () => setVisible(false)) : setVisible(false)
                  }}
                >{confirmText}</a>
              </div>
              <Calendar
                value={selectedValue}
                onChange={val => setSelectedValue(val)}
                {...calendarProps}
              />
            </Popup>
          </>
        )
      }}
    />
  )
}
