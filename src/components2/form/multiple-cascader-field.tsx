import type { CascadePickerProps } from 'antd-mobile'
import type { CascaderActions, CascaderOption, CascaderValue } from 'antd-mobile/es/components/cascader'
import type { MutableRefObject, PropsWithChildren } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { FormControllerProps } from './controller'

import { useRef } from 'react'
import { Cascader } from 'antd-mobile'
import { useFormContext } from 'react-hook-form'
import { pick, omit, without } from 'lodash'
import { IconSVG } from '../../components/icon-svg'
import { controllerPropKeys, FormController } from './controller'

type MultipleCascaderFieldProps<T extends FieldValues> = Omit<FormControllerProps<T>, 'render'>
  & Omit<CascadePickerProps, 'onClick' | 'value'>
  & {
    placeholder?: string
    seperate?: string
    onChange?: (value: (CascaderValue | CascaderOption)[][], methods: UseFormReturn<FieldValues>) => void
    multiple?: boolean
    labelInValue?: boolean
    value?: (CascaderValue | CascaderOption)[][]
  }

export const MultipleCascaderField = <
T extends FieldValues = FieldValues,
>(props: PropsWithChildren<MultipleCascaderFieldProps<T>>) => {
  const controllerProps = pick(props, without(controllerPropKeys, 'onClick'))
  const cascaderProps = omit(props, [...controllerPropKeys, 'placeholder'])
  const {
    placeholder = '请选择',
    labelInValue = false,
    onClick,
  } = props

  const methods = useFormContext()
  const tempValue = useRef<CascaderOption[][]>([])
  const returnValues = labelInValue ? tempValue.current : tempValue.current.map(item => item.map(({ value }) => value))

  const onValueChange = (val, extend, fieldChange) => {
    const labelValues = extend.items.map(({ children, ...rest }) => ({ ...rest }))
    if (extend.items.length > 0) {
      tempValue.current.push(labelValues)
      fieldChange(returnValues)
      props.onChange?.(returnValues, methods)
    }
  }

  const onItemDelete = (item, index, fieldChange) => {
    tempValue.current.splice(index, 1)
    fieldChange(returnValues)
    props.onChange?.(returnValues, methods)
  }

  return (
    <FormController<T, CascaderActions>
      onClick={(e, ref) => {
        ref.current.open()
        onClick?.(e, ref as unknown as MutableRefObject<void>)
      }}
      {...controllerProps}
      render={({
        onChange,
        ...restField
      }) => (
        <Cascader
          onConfirm={(value, extend) => onValueChange(value, extend, onChange)}
          {...restField}
          {...cascaderProps}
        >
          {() => {
            return (
              <div className="flex justify-between text-base">
                <div>
                  {
                    tempValue.current.length > 0
                      ? <>
                        {
                          tempValue.current.map((item, index) => {
                            return (
                              <div
                                className="text-[#585858] text-sm inline-block border-[1px] border-solid border-[#D9D9D9] rounded bg-white py-[2px] px-[4px] mr-2 mb-2"
                                key={index}
                              >
                                {item[item.length - 1]?.label}
                                <IconSVG
                                  className="w-[12px] h-[12px] mb-[2px]" symbol="icon-xianxing_guanbi" data-type="close" onClick={(e) => {
                                    e.stopPropagation()
                                    onItemDelete(item, index, onChange)
                                  }}
                                />
                              </div>
                            )
                          })
                        }
                      </>
                      : <span className="text-[#B0B0B0]">{placeholder}</span>
                  }
                </div>
                <IconSVG symbol="icon-xianxing_you" />
              </div>
            )
          }}
        </Cascader>
      )}
    />
  )
}
