import { useState } from 'react'
import { Button, Toast, ActionSheet } from 'antd-mobile'
import { useForm } from 'react-hook-form'
import {
  FormContainer,
  CascaderField,
  InputField,
} from '@/common/components/form'
import { useRouter } from '@/common/hooks/use-router'
import { useToastMutation } from '@/common/hooks/react-query'
import { useAddress } from '@/common/hooks'
import type { CreateOutInfo } from './api'
import { fetchMerchantCreate } from './api'
import { isMobilePhone } from '@/common/utils/validator'
import { Loading } from '@/common/components/loading'
import { isHonor } from '@/common/utils/env'
import { getIsVentureCompany } from '@/common/utils/storage'

const agentTypeMap = {
  company: 1,
  person: 2,
}

export default function MerchantCreate () {
  const [visible, setVisible] = useState(false)
  const [needGoAuthPage, setNeedGoAuthPage] = useState(false)
  const form = useForm()
  const { searchParams, navigator } = useRouter()
  const isVentureCompany = getIsVentureCompany()

  // 提交
  const { mutate: fetchMerchantCreateMutate, isLoading, data = {} } = useToastMutation({
    mutationFn: fetchMerchantCreate,
    onSuccess () {
      Toast.clear()
      if (needGoAuthPage) {
        // 去认证
        setVisible(true)
        return
      }
      Toast.show('创建成功')
      // 跳转到列表页
      navigator.navigate('/merchant/list')
    },
  })

  const { accountId: id } = data as CreateOutInfo

  // 获取省市区
  const addressList = useAddress()

  // 创建表单实例
  const onSubmit = (values) => {
    const { area = [], ...otherValues } = values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, city, district] = area

    const params = {
      ...otherValues,
      // province: province?.value,
      // provinceName: province?.label,
      city: city?.value,
      cityName: city?.label,
      district: district?.value,
      districtName: district?.label,
      contactMobile: otherValues.mobile,
    }
    Toast.show({
      icon: 'loading',
      content: '正在创建',
    })
    fetchMerchantCreateMutate(params)
  }

  const onError = ({ errors, formValues }) => {
    // 提交表单校验失败触发

    setNeedGoAuthPage(false)
    console.log('onError', errors, formValues)
  }

  const actions = [
    {
      text: '个人认证',
      key: 'person',
      hide: (!isVentureCompany && isHonor),
    },
    {
      text: '企业认证',
      key: 'company',
    },
  ].filter(item => !item.hide)

  if (isLoading) return <Loading />
  // if (error) return <Error text="数据异常" />

  return (
    <div className="h-screen w-full overflow-y-auto bg-[#F2F2F2]">
      <FormContainer
        className="mb-16 mt-2"
        form={form}
        onSuccess={onSubmit}
        onError={onError}
      >
        <InputField
          required
          label="商户手机号"
          name="mobile"
          rules={{
            validate: val => isMobilePhone(val) || '请输入正确的手机号',
          }}
          defaultValue={searchParams.get('mobile') || ''}
          disabled
        />
        <InputField
          required
          label="商户名称"
          name="name"
          rules={{
            maxLength: {
              value: 50,
              message: '不能超过50个字符',
            },
          }}
        />
        <InputField
          required
          label="联系人姓名"
          name="contact"
          rules={{
            maxLength: {
              value: 50,
              message: '不能超过50个字符',
            },
          }}
        />
        <CascaderField
          required
          label="所在地区"
          name="area"
          rules={{
            validate: val => val.length >= 2 || '请至少选择省和市',
          }}
          labelInValue
          options={addressList}
        />
        <InputField
          label="详细地址"
          name="address"
          rules={{
            maxLength: {
              value: 200,
              message: '不能超过200个字符',
            },
          }}
        />

        <div className="fixed w-full flex p-2 bottom-0 left-0  bg-white space-x-2">
          <Button
            block
            size="large"
            type="submit"
          >
            保存信息
          </Button>
          <Button
            block
            size="large"
            color="primary"
            type="submit"
            onClick={() => {
              setNeedGoAuthPage(true)
            }}
          >
            立即认证
          </Button>
        </div>
      </FormContainer>

      <ActionSheet
        visible={visible}
        actions={actions}
        onAction={(e) => {
          if (!id) return Toast.show('数据异常')
          if (e.key === 'person') {
            if (isHonor) {
              navigator.href('honor',
                {
                  pathname: `/crm/customer/${id}/auth-edit`,
                  query: {
                    authType: `${agentTypeMap.person}`,
                    isJumpList: 'true',
                  },
                })
            } else {
              navigator.href('mammon',
                {
                  pathname: `/crm/customer-agent/${id}/auth-personal`,
                })
            }

            // 电小二 router.push(`/crm/customer/${createCustomerCb.id}/auth-edit?authType=${agentTypeMap.person}&isJumpList=true`)
            // 电小代 if (createCustomerCb?.id) router.replace(`/crm/customer-agent/${createCustomerCb.id}/auth-personal`)
          }
          if (e.key === 'company') {
            if (isHonor) {
              navigator.href('honor',
                {
                  pathname: `/crm/customer/${id}/auth-edit`,
                  query: {
                    authType: `${agentTypeMap.company}`,
                    isJumpList: 'true',
                  },
                })
            } else {
              navigator.href('mammon',
                {
                  pathname: `/crm/customer-agent/${id}/auth-firm`,
                })
            }
            // 电小二 if (createCustomerCb?.id) router.push(`/crm/customer/${createCustomerCb.id}/auth-edit?authType=${agentTypeMap.company}&isJumpList=true`)
            // 电小代 if (createCustomerCb?.id) router.replace(`/crm/customer-agent/${createCustomerCb.id}/auth-firm`)
          }
        }}
        onClose={() => setVisible(false)}
      />
    </div>
  )
}
