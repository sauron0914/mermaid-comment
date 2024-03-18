import type { SelectorOption, SelectorProps } from 'antd-mobile'
import type { PropsWithChildren } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { FormControllerProps } from './controller'

import { controllerPropKeys, FormController } from './controller'
import { Selector } from 'antd-mobile'
import { useFormContext } from 'react-hook-form'
import { pick, omit } from 'lodash'

type SelectorValue = string | number

type SelectorFieldProps<T extends FieldValues> = Omit<FormControllerProps<T>, 'render' |'onClick'>
  & Omit<SelectorProps<SelectorValue>, 'onChange'>
  & {
    onChange?: (
      value: SelectorValue[] | SelectorOption<SelectorValue>[],
      extend: {
        items: SelectorOption<SelectorValue>[];
      },
      methods: UseFormReturn<FieldValues>
    ) => void
    labelInValue?: boolean
  }

export const SelectorField = <
  T extends FieldValues = FieldValues,
>(props: PropsWithChildren<SelectorFieldProps<T>>) => {
  const controllerProps = pick(props, controllerPropKeys)
  const selectorProps = omit(props, [...controllerPropKeys, 'onChange'])
  const {
    labelInValue = false,
  } = props
  const methods = useFormContext()
  return (
    <FormController
      {...controllerProps}
      render={({
        onChange,
        ref,
        value,
        ...restField
      }) => (
        <Selector
          onChange={(val, extend) => {
            const returnVal = labelInValue ? extend.items : val
            onChange(returnVal)
            props.onChange?.(returnVal, extend, methods)
          }}
          value={labelInValue ? value?.map(item => item.value) : value}
          {...restField}
          {...selectorProps}
        />
      )}
    />
  )
}
