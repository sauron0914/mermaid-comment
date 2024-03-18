import { FormContainer, SelectorField, TextAreaField } from '@/common/components/form'
import { useToastMutation } from '@/common/hooks/react-query'
// eslint-disable-next-line
import { useRouter } from '@dian/app-utils/router'
import { Button, Toast } from 'antd-mobile'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { applyClaimApi } from './api'

const options = [
  { label: '开通分成', value: '开通分成' },
  { label: '修改认证信息', value: '修改认证信息' },
  { label: '查看商家信息', value: '查看商家信息' },
  { label: '其他', value: 'others' },
]

const Claim = () => {
  const [textAreaShow, setTextAreaShow] = useState(false)
  const { searchParams, navigator } = useRouter()
  const form = useForm()

  // 分配
  const { mutate: applyClaim } = useToastMutation({
    mutationFn: applyClaimApi,
    onSuccess () {
      Toast.show({
        content: '商户申请认领成功',
        afterClose () {
          navigator.navigate('/merchant/list')
        },
      })
    },
  })

  const claimSubmit = (data) => {
    const { select, textarea } = data
    if (!searchParams.get('merchantId')) {
      return Toast.show('无商户，不允许申请')
    }
    applyClaim({
      merchantId: Number(searchParams.get('merchantId')),
      applyReason: select[0] === 'others' ? textarea : select[0],
    })
  }
  return (
    <div className="h-screen w-full overflow-auto bg-[#F2F2F2] pt-2 pb-16">
      <FormContainer
        form={form}
        onSuccess={claimSubmit}
        onError={() => {
          // console.log('submit error:', errors)
        }}
      >
        <SelectorField
          required
          label="申请理由"
          name="select"
          columns={2}
          options={options}
          onChange={(val) => {
            setTextAreaShow(val[0] === options[options.length - 1].value)
          }}
        />
        {textAreaShow && <TextAreaField
          required
          label="其他"
          name="textarea"
          rows={3}
          showCount
          maxLength={200}
        />}
        <div className="fixed bottom-0 left-0 p-2 w-full">
          <Button
            block
            disabled={(!form.watch().select?.length) || (form.watch().select[0] === 'others' && !form.watch().textarea)}
            color="primary"
            type="submit"
          >
            确认提交
          </Button>
        </div>
      </FormContainer>

    </div>
  )
}

export default Claim
