import type { PropsWithChildren } from 'react'
import type { ControllerRenderProps, FieldPath, FieldValues, Path, UseControllerProps, UseFormReturn } from 'react-hook-form'
import { useRef } from 'react'
import { useWatch, useFormContext, useController } from 'react-hook-form'
import { assign } from 'lodash'
import { messageMap } from '../../utils/zod'

export type FormControllerProps<
  T extends FieldValues = FieldValues,
  Ref = void
> = UseControllerProps<T, FieldPath<T>> & {
  label: string
  required?: boolean
  dependencies?: FieldPath<T>[]
  render: (field: ControllerRenderProps<T, Path<T>>, methods: UseFormReturn<FieldValues>) => JSX.Element
  onClick?: (e: React.MouseEvent, widgetRef: React.MutableRefObject<Ref>) => void
}

const polymorphicFunction = (
  key: unknown,
  val: FieldValues,
) => (
  typeof key === 'function'
    ? key(val)
    : Boolean(key)
)

export const controllerPropKeys = [
  // custom controller props
  'label',
  'required',
  'dependencies',
  'onClick',
  // default controller props
  'name',
  'control',
  'defaultValue',
  'rules',
  'shouldUnregister',
]

/**
 * @param label 表单label
 */

export const FormController = <
  T extends FieldValues = FieldValues,
  Ref = void
> (props: PropsWithChildren<FormControllerProps<T, Ref>>): JSX.Element => {
  const {
    label,
    name,
    control,
    required,
    dependencies,
    defaultValue,
    rules,
    shouldUnregister,
    render,
    onClick,
  } = props
  const {
    field: { ref, ...restFields },
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
    defaultValue,
    rules: assign({
      ...(required && { required: messageMap.required }),
    }, rules),
    shouldUnregister,
  })
  const methods = useFormContext()
  const { getValues, trigger } = methods
  const widgetRef = useRef<Ref>(null) as React.MutableRefObject<Ref>
  const formValues: FieldValues = {
    ...useWatch(),
    ...getValues(),
  }

  return (
    <>
      <div
        className="relative bg-white py-3 pr-3 ml-3" onClick={async (e) => {
          if (dependencies) {
            const dependeciesValid = (await Promise.all([
              ...dependencies.map(dependence => trigger(dependence)),
            ])).every(n => n === true)

            if (dependeciesValid) {
              onClick?.(e, widgetRef)
            }
          } else {
            onClick?.(e, widgetRef)
          }
        }}
      >
        {(polymorphicFunction(required, formValues)) && <span className="absolute top-3 -left-2 text-lg text-red-500 mr-2">*</span>}
        <label className="text-base">{label}</label>
        <div className="mt-1">
          {render({
            ref (instance) {
              widgetRef.current = instance
            },
            ...restFields,
          }, methods)}
        </div>
        {fieldError && <p className="mt-1 text-red-500">{fieldError.message}</p>}
      </div>
    </>
  )
}
