import type { PropsWithChildren } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { RadioGroupProps, RadioProps } from 'antd-mobile'
import type { RadioValue } from 'antd-mobile/es/components/radio'
import type { FormControllerProps } from './controller'

import { Radio } from 'antd-mobile'
import { useFormContext } from 'react-hook-form'
import { pick, omit } from 'lodash'
import classnames from 'classnames'
import { controllerPropKeys, FormController } from './controller'

type RadioOption = Pick<
  RadioProps,
  | 'disabled'
  | 'icon'
  | 'id'
  | 'value'
> & {
  label: string
}

type RadioFieldProps<T extends FieldValues> = Omit<FormControllerProps<T>, 'render' |'onClick'>
  & Omit<RadioGroupProps, 'onChange'>
  & {
    options: RadioOption[]
    block?: boolean
    onChange?: (value: RadioValue, methods: UseFormReturn<FieldValues>) => void
  }

export const RadioField = <
  T extends FieldValues = FieldValues,
>(props: PropsWithChildren<RadioFieldProps<T>>) => {
  const controllerProps = pick(props, controllerPropKeys)
  const radioGroupProps = omit(props, [...controllerPropKeys, 'onChange', 'block'])
  const { options = [], ...restRadioGroupProps } = radioGroupProps
  const methods = useFormContext()

  return (
    <FormController<T>
      {...controllerProps}
      render={({
        ref,
        onChange,
        ...restField
      }) => (
        <Radio.Group
          onChange={(val) => {
            onChange(val)
            props.onChange?.(val, methods)
          }}
          {...restRadioGroupProps}
          {...restField}
        >
          <div className={classnames(props.block ? 'space-y-2' : 'space-x-2')}>
            {
              options.map(({ label, ...radioProps }, index) => (
                <Radio
                  key={index}
                  block={props.block}
                  {...radioProps}
                >
                  {label}
                </Radio>
              ))
            }
          </div>
        </Radio.Group>
      )}
    />
  )
}
