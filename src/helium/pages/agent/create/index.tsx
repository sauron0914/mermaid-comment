import { useState } from 'react'
import { Button, Toast } from 'antd-mobile'
import { useForm } from 'react-hook-form'
import {
  FormContainer,
  PickerField,
  CascaderField,
  InputField,
  SelectorField,
  MultipleCascaderField,
} from '@/common/components/form'
import { useRouter } from '@/common/hooks/use-router'
import { useToastQuery, useToastMutation } from '@/common/hooks/react-query'
import { useAddress } from '@/common/hooks'
import { fetchAgentLevelList, fetchAgentCreate, fetchAgentHierarchy } from './api'
import { isMobilePhone } from '@/common/utils/validator'
import Error from '@/common/components/error'
import { Loading } from '@/common/components/loading'

export default function AgentCreate () {
  const [needGoAuthPage, setNeedGoAuthPage] = useState(false)
  const form = useForm()

  const { searchParams, navigator } = useRouter()
  const { data: agentHierarchy, isLoading, error } = useToastQuery({
    queryKey: ['fetchAgentHierarchy'],
    queryFn: fetchAgentHierarchy,
  })

  const { data: levelListData = [] } = useToastQuery({
    queryKey: ['agentLevel'],
    queryFn: fetchAgentLevelList,
    select (res) {
      const levelList = res.map(item => ({
        label: `${item.name}-${item.feeRate}%`,
        value: `${item.id}`,
      }))
      return levelList
    },
  })

  // 提交
  const { mutate: fetchAgentCreateMutate } = useToastMutation({
    mutationFn: fetchAgentCreate,
    onSuccess (data) {
      Toast.show('创建成功')

      if (needGoAuthPage) {
        // 去认证
        navigator.href('honor',
          {
            pathname: `/crm/customer-agent/${data}/auth-edit`,
            query: {
              authType: `${form.getValues('subType')[0]}`,
            },
          })
        return
      }
      // 跳转到列表页
      navigator.navigate('/agent/list')
    },
  })

  // 获取省市区
  const addressList = useAddress()

  // 创建表单实例

  const onSubmit = (values) => {
    const { addressAreas = [], address = [], agentLevel, ...otherValues } = values
    const [province, city, district] = address

    // 提交参数只需要选择区域最后一级的名字和编码
    const agentAreas = addressAreas.map((item) => {
      return item.map(({ label, value }, index) => {
        if (index === 0) return { province: value, provinceName: label }
        if (index === 1) return { city: value, cityName: label }
        if (index === 2) return { district: value, districtName: label }
        return undefined
      })
    }).map(item => item[item.length - 1])

    const params = {
      ...otherValues,
      province,
      city,
      district,
      agentAreas,
      agentLevel: agentLevel?.[0],
      subType: values.subType[0],
    }
    Toast.show({
      icon: 'loading',
      content: '正在创建',
    })
    fetchAgentCreateMutate(params)
  }

  const onError = ({ errors, formValues }) => {
    setNeedGoAuthPage(false)
    // 提交表单校验失败触发
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
        <InputField
          required
          label="代理商手机号"
          name="mobile"
          rules={{
            validate: val => isMobilePhone(val) || '请输入正确的手机号',
          }}
          defaultValue={searchParams.get('mobile') || ''}
          disabled
        />
        <SelectorField
          required
          label="代理商类型"
          name="subType"
          columns={2}
          options={[
            { label: '个人', value: 2 },
            { label: '企业', value: 1 },
          ]}
        />
        {
          form.watch('subType')?.[0] === 2 &&
          (
            <InputField
              required
              label="代理商名称"
              name="name"
              rules={{
                maxLength: {
                  value: 50,
                  message: '不能超过50个字符',
                },
              }}
            />
          )
        }
        {
          form.watch('subType')?.[0] === 1 &&
          (
            <>
              <InputField
                required
                label="企业名称"
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
                label="企业负责人名称"
                name="contact"
                rules={{
                  maxLength: {
                    value: 50,
                    message: '不能超过50个字符',
                  },
                }}
              />
            </>
          )
        }
        {
          // 当 agentHierarchy === 1 时只能创建二级代理，二级代理不需要代理商级别字段
          agentHierarchy !== 1 &&
          (
            <PickerField
              required
              label="代理商级别"
              name="agentLevel"
              columns={[levelListData]}
            />
          )
        }
        <CascaderField
          required
          label="代理商省市区"
          name="address"
          rules={{
            validate: val => val.length >= 2 || '请至少选择省和市',
          }}
          options={addressList}
        />
        <InputField
          required
          label="代理商详细地址"
          name="agentAddress"
          rules={{
            maxLength: {
              value: 200,
              message: '不能超过200个字符',
            },
          }}
        />
        <MultipleCascaderField
          required
          label="代理区域"
          name="addressAreas"
          rules={{
            validate: val => (val && val.length > 0 ? val.map(n => n.length >= 2).every(n => !!n) : true) || '请至少选择省和市',
          }}
          labelInValue
          options={addressList}
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
    </div>
  )
}
