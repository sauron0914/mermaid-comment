import type { PropsWithChildren } from 'react'
import type { FieldErrors, FieldValues, SubmitHandler, UseFormProps, UseFormReturn } from 'react-hook-form'

import { useWatch, FormProvider } from 'react-hook-form'
import classnames from 'classnames'

type EnhanceErrors<T extends FieldValues> = {
  errors: FieldErrors<T>
  formValues: FieldValues
}

type EnhanceSubmitErrorHandler<
  TFieldValues extends FieldValues
  > = (errors: EnhanceErrors<TFieldValues>, event?: React.BaseSyntheticEvent) => unknown | Promise<unknown>;

type FormContainerProps<T extends FieldValues = FieldValues>
  = PropsWithChildren<
    UseFormProps<T> & {
      className?: string
      form: UseFormReturn<T>
      onSuccess: SubmitHandler<T>,
      onError: EnhanceSubmitErrorHandler<T>
    }
  >

interface FormContainerWithRefType extends React.FC<FormContainerProps<FieldValues>> {
  <T extends FieldValues>(props: FormContainerProps<T>): ReturnType<React.FC<FormContainerProps<T>>>
}

export const FormContainer: FormContainerWithRefType = <
  TFieldValues extends FieldValues = FieldValues
>(
    {
      className,
      form,
      onSuccess,
      onError,
      children,
    }: PropsWithChildren<FormContainerProps<TFieldValues>>,
  ) => {
  const { handleSubmit, getValues } = form

  const formValues: FieldValues = {
    ...useWatch({
      control: form.control,
    }),
    ...getValues(),
  }

  return (
    <FormProvider {...form}>
      <form
        className={classnames('divide-y divide-[#efefef] bg-white', className)}
        onSubmit={handleSubmit(onSuccess, (errors, event) => onError?.({ errors, formValues }, event))}
      >
        {children}
      </form>
    </FormProvider>
  )
}

FormContainer.displayName = 'FormContainer'
