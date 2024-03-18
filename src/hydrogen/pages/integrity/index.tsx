/* eslint-disable no-console */
import { Button, Card, Toast } from 'antd-mobile'
import {
  FormContainer,
  InputField,
  DatePickerField,
  ImageUploaderField,
} from '@dian/common/components/form'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { createIntegrityRecord } from './api'

export default function FormDemo () {
  const formMethod = useForm()

  const { mutate } = useMutation({
    mutationFn: createIntegrityRecord,
    onSuccess (data) {
      Toast.show(data)
      formMethod.reset({})
      window.history.go(-1)
    },
  })

  const formSubmit = (data) => {
    const { complaintTime, ...rest } = data
    mutate({
      ...rest,
      originType: 3,
    })
  }

  return (
    <div className="bg-[#F2F2F2] h-screen">
      <Card title="我要举报">
        <FormContainer
          form={formMethod}
          onSuccess={formSubmit}
          onError={(errors) => {
            console.log('submit error:', errors)
          }}
        >
          <InputField
            required
            label="举报对象"
            name="reportedPerson"
            rules={{
              required: '请必须填写',
            }}
          />
          <InputField
            required
            label="举报内容"
            name="complaintContent"
            rules={{
              required: '请必须填写',
            }}
          />
          <ImageUploaderField
            label="证据附件"
            name="fileUrls"
          />
          <DatePickerField
            label="举报日期"
            name="complaintTime"
            disabled
            defaultValue={new Date()}
          />
          <Button className="w-full" color="primary" type="submit">提交</Button>
        </FormContainer>
      </Card>
    </div>
  )
}
