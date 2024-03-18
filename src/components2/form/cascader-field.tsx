import type { MutableRefObject, PropsWithChildren } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { CascadePickerProps } from 'antd-mobile'
import type { CascaderActions, CascaderOption, CascaderValueExtend } from 'antd-mobile/es/components/cascader'
import type { FormControllerProps } from './controller'

import { useFormContext } from 'react-hook-form'
import { Cascader } from 'antd-mobile'
import { pick, omit, without } from 'lodash'
import { IconSVG } from '../../components/icon-svg'
import { controllerPropKeys, FormController } from './controller'

type CascaderFieldProps<T extends FieldValues> = Omit<FormControllerProps<T>, 'render'>
  & Omit<CascadePickerProps, 'onClick'>
  & {
    placeholder?: string
    seperate?: string
    onChange?: (
      value: string[] | (CascaderOption | null)[],
      extend: CascaderValueExtend,
      methods: UseFormReturn<FieldValues>
    ) => void
    labelInValue?: boolean
  }

export const CascaderField = <
  T extends FieldValues = FieldValues,
>(props: PropsWithChildren<CascaderFieldProps<T>>) => {
  const controllerProps = pick(props, without(controllerPropKeys, 'onClick'))
  const cascaderProps = omit(props, [...controllerPropKeys, 'placeholder'])
  const {
    placeholder = '请选择',
    labelInValue = false,
    seperate = '-',
    onClick,
  } = props

  const methods = useFormContext()

  return (
    <FormController<T, CascaderActions>
      onClick={(e, ref) => {
        ref.current.open()
        onClick?.(e, ref as unknown as MutableRefObject<void>)
      }}
      {...controllerProps}
      render={({
        onChange,
        value,
        ...restField
      }) => (
        <Cascader
          onConfirm={(value, extend) => {
            const returnValue = labelInValue ? extend.items : value
            onChange(returnValue)
            methods.trigger(props.name)
            props.onChange?.(returnValue, extend, methods)
          }}
          value={labelInValue ? value?.map(item => item.value) : value}
          {...restField}
          {...cascaderProps}
        >
          {(items) => {
            return (
              <div className="flex justify-between text-base">
                {
                items.length > 0
                  ? items.map(item => item?.label).join(seperate)
                  : <span className="text-[#B0B0B0]">{placeholder}</span>
              }
                <IconSVG symbol="icon-xianxing_you" />
              </div>
            )
          }}
        </Cascader>
      )}
    />
  )
}
