import type { PropsWithChildren } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { TextAreaProps } from 'antd-mobile'
import type { FormControllerProps } from './controller'

import { TextArea } from 'antd-mobile'
import { useFormContext } from 'react-hook-form'
import { pick, omit, assign } from 'lodash'
import { controllerPropKeys, FormController } from './controller'
import { isEmoji } from '../../../common/utils/validator'

type TextAreaFieldProps<T extends FieldValues> = Omit<FormControllerProps<T>, 'render' |'onClick'>
  & Omit<TextAreaProps, 'onChange'>
  & {
    onChange?: (value: string, methods: UseFormReturn<FieldValues>) => void
    forbiddenEmoji?: boolean
  }

/**
 * @param {boolean} forbiddenEmoji - 校验不能输入emoji，默认为true，传入false可以关闭此内置校验
 * @param {Function|Object} rules.validate - 传入function会替换内置校验，传入object会跟内置校验合并，优先使用object
 */

export const TextAreaField = <
  T extends FieldValues = FieldValues,
>(props: PropsWithChildren<TextAreaFieldProps<T>>) => {
  const controllerProps = pick(props, controllerPropKeys)
  const { rules, ...restControllerProps } = controllerProps
  const { validate, ...restRules } = rules ?? {}
  const textareaProps = omit(props, [...controllerPropKeys, 'onChange'])
  const { placeholder = '请输入', forbiddenEmoji = true, ...restTextAreaProps } = textareaProps
  const methods = useFormContext()

  return (
    <FormController<T>
      rules={assign({
        validate: typeof validate === 'function'
          ? validate
          : {
            ...(forbiddenEmoji && {
              forbiddenEmoji: val => !val || !isEmoji(val) || '不能输入emoji类型',
            }),
            ...validate,
          },
      }, restRules)}
      {...restControllerProps}
      render={({
        onChange,
        ...restField
      }) => (
        <TextArea
          onChange={(val) => {
            onChange(val)
            props.onChange?.(val, methods)
          }}
          placeholder={placeholder}
          {...restTextAreaProps}
          {...restField}
        />
      )}
    />
  )
}
