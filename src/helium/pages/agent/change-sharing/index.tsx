import { Button, Toast } from 'antd-mobile'
import { useForm } from 'react-hook-form'
import {
  FormContainer,
  InputField,
  SelectorField,
} from '@/common/components/form'
import { useRouter } from '@/common/hooks/use-router'
import { useToastMutation } from '@/common/hooks/react-query'
import { addAgentFeeRate } from './api'

export default function ChangeSharing () {
  const form = useForm()

  const { searchParams, navigator } = useRouter()

  // 提交
  const { mutate: addAgentFeeRateMutate } = useToastMutation({
    mutationFn: addAgentFeeRate,
    onSuccess () {
      Toast.show('创建成功')
      // 跳转到列表页
      navigator.navigate(-1)
      // if (searchParams.get('from') === 'list') {
      //   navigator.navigate('/agent/list')
      // } else {
      //   navigator.navigate(`/agent/${searchParams.get('agentId')}/detail`)
      // }
    },
  })

  // 创建表单实例

  const onSubmit = (values) => {
    const { activeFeeRateType, feeRate } = values
    if (!searchParams.get('agentId')) {
      Toast.show('数据异常')
    }

    const params = {
      activeFeeRateType: activeFeeRateType[0],
      feeRate,
      agentId: searchParams.get('agentId'),
    }

    Toast.show({
      icon: 'loading',
      content: '正在创建',
    })
    addAgentFeeRateMutate(params)
  }

  const onError = ({ errors, formValues }) => {
    // 提交表单校验失败触发
    // eslint-disable-next-line no-console
    console.log('onError', errors, formValues)
  }

  return (
    <div className="h-screen w-full overflow-y-auto bg-[#F2F2F2]">
      <FormContainer
        className="mb-16 mt-2"
        form={form}
        onSuccess={onSubmit}
        onError={onError}
      >
        <InputField
          label="现有分成"
          name="oldRate"
          defaultValue={`${searchParams.get('feeRate') || 0}%`}
          disabled
        />

        <InputField
          required
          type="number"
          label="期望分成"
          name="feeRate"
          rules={{
            validate: val => /^(100|\d{1,2})$/.test(val) || '请输入正确的分成比例',
          }}
        />

        <SelectorField
          required
          label="生效时间"
          name="activeFeeRateType"
          columns={2}
          options={[
            { label: '(审批完成) 当月生效', value: 0 },
            { label: '(审批完成) 次月生效 ', value: 1 },
          ]}
        />

        <div className="fixed w-full flex p-2 bottom-0 left-0  bg-white space-x-2">
          <Button
            block
            size="large"
            onClick={() => {
              navigator.navigate({
                pathname: '/agent/sharing-record',
                query: {
                  agentId: `${searchParams.get('agentId')}`,
                },
              })
            }}
          >
            分成变更记录
          </Button>
          <Button
            block
            size="large"
            color="primary"
            type="submit"
          >
            提交审批
          </Button>
        </div>
      </FormContainer>
    </div>
  )
}
