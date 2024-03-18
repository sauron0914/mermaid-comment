/* eslint-disable no-console */
import { Button, Card, Stepper, Toast } from 'antd-mobile'
import {
  FormContainer,
  FormController,
  InputField,
  CascaderField,
  CheckListField,
  DatePickerField,
  MultipleCascaderField,
  PickerField,
  RadioField,
  SelectorField,
  TextAreaField,
  CalendarField,
} from '@/common/components/form'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useAddress } from '@/common/hooks'
import { ImageUploaderField } from '@/common/components/form/image-uploader-field'

const checkListData = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
  { label: 'E', value: 'E' },
  { label: 'F', value: 'F' },
  { label: 'G', value: 'G' },
  { label: 'H', value: 'H' },
  { label: 'I', value: 'I' },
  { label: 'J', value: 'J' },
  { label: 'K', value: 'K' },
  { label: 'L', value: 'L' },
  { label: 'M', value: 'M' },
  { label: 'N', value: 'N' },
  { label: 'O', value: 'O' },
  { label: 'P', value: 'P' },
  { label: 'Q', value: 'Q' },
  { label: 'R', value: 'R' },
  { label: 'S', value: 'S' },
  { label: 'T', value: 'T' },
  { label: 'U', value: 'U' },
  { label: 'V', value: 'V' },
  { label: 'W', value: 'W' },
  { label: 'X', value: 'X' },
  { label: 'Y', value: 'Y' },
  { label: 'Z', value: 'Z' },
]

export default function FormDemo () {
  const address = useAddress()

  const formMethod1 = useForm()
  const formMethod2 = useForm()
  const formMethod3 = useForm()

  const num1 = useRef(0)
  const num2 = useRef(0)

  return (
    <div className="bg-[#F2F2F2] h-screen">
      <Card title="内置表单组件">
        <FormContainer
          form={formMethod1}
          onSuccess={(data) => {
            Toast.show({
              content: JSON.stringify(data, null, ' '),
              duration: 3000,
            })
          }}
          onError={(errors) => {
            console.log('submit error:', errors)
          }}
        >
          <InputField
            required
            label="Input"
            name="input"
            rules={{
              maxLength: 5,
              required: '请必须填写',
            }}
          />
          <SelectorField
            required
            label="Selector"
            name="select"
            columns={2}
            options={[
              { label: 'A', value: 'A' },
              { label: 'B', value: 'B' },
            ]}
          />
          <RadioField
            required
            label="Radio"
            name="radio"
            options={[
              { label: '第一项', value: 1 },
              { label: '第二项', value: 2 },
              { label: '第三项', value: 3 },
            ]}
          />
          <PickerField
            required
            label="Picker"
            name="picker"
            columns={[
              [
                { label: 'A', value: 'A' },
                { label: 'B', value: 'B' },
              ],
            ]}
          />
          <CheckListField
            required
            label="MultiplePicker"
            name="multiplePicker"
            showSearch={false}
            multiple
            options={[
              { label: 'Apple', value: 'apple' },
              { label: 'Orange', value: 'orange' },
              { label: 'Banana', value: 'banana' },
            ]}
          />
          <DatePickerField
            required
            label="DatePicker"
            name="dataPicker"
            labelWithUnit
            // precision="week-day"
          />
          <CalendarField
            label="Calendar"
            name="calendar"
            selectionMode="range"
            max={new Date('2023-07-05')}
            min={new Date()}
          />
          <CascaderField
            required
            label="Cascader"
            name="cascader"
            options={address}
          />
          <MultipleCascaderField
            required
            label="MultipleCascader"
            name="multipleCascader"
            labelInValue
            options={address}
          />
          <CheckListField
            required
            label="CheckList"
            name="checklist"
            options={checkListData}
          />
          <TextAreaField
            required
            label="TextArea"
            name="textarea"
            rows={3}
            showCount
            maxLength={50}
          />
          <ImageUploaderField
            required
            label="ImageUploader"
            name="imageUploader"
          />
          <Button className="w-full" color="primary" type="submit">submit</Button>
        </FormContainer>
      </Card>
      <Card title="自定义表单域">
        <FormContainer
          form={formMethod2}
          onSuccess={(data) => {
            console.log('submit success:', data)
            Toast.show(JSON.stringify(data, null, ' '))
          }}
          onError={(errors) => {
            console.log('submit error:', errors)
          }}
        >
          <FormController
            label="自定义表单组件"
            name="stepper"
            defaultValue={0}
            render={({
              ref,
              value,
              onChange,
              ...field
            }) => (
              <div className="flex items-center">
                <Stepper
                  value={num1.current}
                  onChange={(val) => {
                    num1.current = val
                    onChange(num1.current + num2.current)
                  }}
                  {...field}
                />
                  &nbsp;&nbsp;&nbsp;+&nbsp;&nbsp;&nbsp;
                <Stepper
                  value={num2.current}
                  onChange={(val) => {
                    num2.current = val
                    onChange(num1.current + num2.current)
                  }}
                  {...field}
                /> = {value}
              </div>
            )}
          />
          <Button className="w-full" color="primary" type="submit">submit</Button>
        </FormContainer>
      </Card>
      <Card title="联动示例">
        <FormContainer
          form={formMethod3}
          onSuccess={(data) => {
            console.log('submit success:', data)
            Toast.show(JSON.stringify(data, null, ' '))
          }}
          onError={(errors) => {
            console.log('submit error:', errors)
          }}
        >
          <SelectorField
            required
            label="Selector"
            name="select"
            columns={2}
            options={[
              { label: 'A', value: 'A' },
              { label: 'B', value: 'B' },
            ]}
            onChange={(val, _, { resetField }) => {
              if (val[0] === 'B') {
                resetField('picker')
              }
            }}
          />
          <PickerField
            label="Picker"
            name="picker"
            dependencies={['select']}
            columns={[
              [
                { label: 'A', value: 'A' },
                { label: 'B', value: 'B' },
              ],
            ]}
          />
          <RadioField
            label="Radio"
            name="radio"
            block={formMethod3.watch('select')?.[0] === 'A'}
            options={[
              { label: '第一项', value: 1 },
              { label: '第二项', value: 2 },
              { label: '第三项', value: 3 },
              { label: '第四项', value: 4 },
            ]}
          />
          <CheckListField
            required
            label="CheckList"
            name="checklist"
            dependencies={['picker']}
            options={checkListData}
          />
          <Button className="w-full" color="primary" type="submit">submit</Button>
        </FormContainer>
      </Card>
    </div>
  )
}
