import type { CheckValue } from '@/common/components/form'

import { useState } from 'react'
import { Button, Toast } from 'antd-mobile'
import { useForm } from 'react-hook-form'
import {
  CascaderField,
  CheckListField,
  FormContainer,
  InputField,
  SelectorField,
} from '@/common/components/form'
import { useRouter } from '@/common/hooks/use-router'
import { useToastMutation, useToastQuery } from '@/common/hooks/react-query'
import { useAddress, useBankInfo, useSubBankInfo } from '@/common/hooks'
import { isIDNumber } from '@/common/utils/validator'
import { addAgentBankList, fetchAgentPersonalSupport } from './api'
import Error from '@/common/components/error'
import { Loading } from '@/common/components/loading'

export default function AgentBankCreate () {
  const [bankInfo, setBankInfo] = useState<CheckValue[]>([])
  const [searchBranchName, setSearchBranchName] = useState('')
  const { navigator, searchParams } = useRouter()
  const addressList = useAddress()
  const bankList = useBankInfo()
  const subBankList = useSubBankInfo({
    queryKey: [bankInfo, searchBranchName],
    queryParams: {
      bankNo: bankInfo?.[0],
      branchName: searchBranchName,
    },
    enabled: !!bankInfo && !!searchBranchName,
  })

  // /personal-support/{id}

  const { data: personalSupportInfo, isLoading, error } = useToastQuery({
    queryKey: ['fetchAgentPersonalSupport'],
    queryFn: () => fetchAgentPersonalSupport({
      id: searchParams.get('agentId'),
    }),
  })

  // 提交
  const { mutate: addAgentBankListMutate } = useToastMutation({
    mutationFn: addAgentBankList,
    onSuccess () {
      // 跳转到列表页
      Toast.show('新增成功')
      navigator.navigate({ pathname: `/agent/${searchParams.get('agentId')}/detail` })
    },
  })

  const form = useForm()

  const onSubmit = (values) => {
    // 提交表单且数据验证成功后触发
    const { bankInfo, bankBranchCode, area, cardType, ...rest } = values
    const [provinceCode, cityCode, districtCode] = area
    // mchId
    // console.log('onSubmit', values, provinceCode, cityCode, districtCode)

    const param = {
      ...rest,
      cardType: cardType[0],
      bankCnapsCode: bankInfo[0],
      bankBranchCode: bankBranchCode[0],
      provinceCode: `${provinceCode}`,
      cityCode: `${cityCode}`,
      districtCode: `${districtCode}`,
      mchId: searchParams.get('agentId') || '',
    }
    addAgentBankListMutate(param)
  }

  const onError = ({ errors, formValues }) => {
    // 提交表单且数据验证成功后触发
    // eslint-disable-next-line no-console
    console.log('onError', errors, formValues)
  }
  if (isLoading) return <Loading />
  if (error) return <Error text="数据异常" />

  return (
    <div className="h-screen w-full overflow-y-auto bg-[#F2F2F2]">
      <FormContainer
        className="mb-16 mt-2"
        form={form}
        onSuccess={onSubmit}
        onError={onError}
      >
        <SelectorField
          required
          label="银行卡类型"
          name="cardType"
          columns={2}
          options={[
            { label: '个人', value: 2, disabled: personalSupportInfo?.subType === 1 && personalSupportInfo?.supportPersonal !== 1 },
            { label: '企业', value: 1, disabled: personalSupportInfo?.subType === 2 },
          ]}
        />
        <InputField
          required
          label="持卡人姓名"
          name="accountName"
        />
        {
          form.watch('cardType')?.[0] === 2 &&
          (
            <InputField
              required
              label="持卡人身份证"
              name="idCardNo"
              rules={{
                validate: val => isIDNumber(val) || '请输入正确的身份证号',
              }}
            />
          )
        }
        <InputField
          required
          label="银行卡号"
          name="bankCardNo"
        />
        <CascaderField
          required
          label="银行卡所在地"
          name="area"
          options={addressList}
        />
        <CheckListField
          required
          label="开户银行"
          name="bankInfo"
          popupTitle="选择开户银行"
          options={bankList}
          countHeaderRender={count => <span>共 <span className="text-primary">{count}</span> 个银行</span>}
          onChange={(value) => {
            setBankInfo(value)
            setSearchBranchName('')
            form.resetField('bankBranchCode')
          }}
        />
        <CheckListField
          required
          label="支行名称"
          name="bankBranchCode"
          popupTitle="选择支行名称"
          options={subBankList}
          dependencies={['bankInfo']}
          countHeaderRender={count => <span>共 <span className="text-primary">{count}</span> 个支行</span>}
          onSearch={val => setSearchBranchName(val)}
          onClear={() => setSearchBranchName('')}
        />
        <div className="fixed w-full flex p-1 bottom-0 bg-white left-0">
          <Button
            block
            color="primary"
            type="submit"
            className="m-1"
            style={{
              height: '48px',
            }}
          >
            保存信息
          </Button>
        </div>
      </FormContainer>
    </div>
  )
}
