import type { MutableRefObject, PropsWithChildren } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { PickerActions } from 'antd-mobile/es/components/picker'
import type { PickerColumnItem, PickerValue, PickerValueExtend } from 'antd-mobile/es/components/picker-view'
import type { FormControllerProps } from './controller'
import type { PickerProps } from 'antd-mobile'

import { useFormContext } from 'react-hook-form'
import { Picker } from 'antd-mobile'
import { pick, omit, without } from 'lodash'
import { controllerPropKeys, FormController } from './controller'
import { IconSVG } from '../../components/icon-svg'

type PickerFieldProps<T extends FieldValues> = Omit<FormControllerProps<T>, 'render'>
  & Omit<PickerProps, 'onClick' | 'visible'>
  & {
    placeholder?: string
    onChange?: (
      value: PickerValue[] | (PickerColumnItem | null)[],
      extend: PickerValueExtend,
      methods: UseFormReturn<FieldValues>
    ) => void
    labelInValue?: boolean
  }

export const PickerField = <
  T extends FieldValues = FieldValues,
>(props: PropsWithChildren<PickerFieldProps<T>>) => {
  const controllerProps = pick(props, without(controllerPropKeys, 'onClick'))
  const pickerProps = omit(props, [...controllerPropKeys, 'placeholder'])
  const {
    placeholder = '请选择',
    labelInValue = false,
    onClick,
  } = props

  const methods = useFormContext()

  return (
    <FormController<T, PickerActions>
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
        <Picker
          onConfirm={(value, extend) => {
            const returnValue = labelInValue ? extend.items : value
            onChange(returnValue)
            methods.trigger(props.name)
            props.onChange?.(returnValue, extend, methods)
          }}
          value={labelInValue ? value?.map(item => item.value) : value}
          {...pickerProps}
          {...restField}
        >{(items) => {
          return (
            <div className="flex justify-between text-base">
              {
                items.length > 0 && items[0] !== null
                  ? items[0]?.label
                  : <span className="text-[#B0B0B0]">{placeholder}</span>
              }
              <IconSVG symbol="icon-xianxing_you" />
            </div>
          )
        }}</Picker>
      )}
    />
  )
}
