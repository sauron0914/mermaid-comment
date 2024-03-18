import { useEffect, useState } from 'react'
import { Toast, Button, Input } from 'antd-mobile'
import { useToastMutation } from '@/common/hooks/react-query'
import { fetchMerchantBasicInfo } from './api'
import { isPhone } from './varify'
import { useRouter } from '@/common/hooks/use-router'

type Mobile = string

export default function MerchantCheck () {
  const { navigator, searchParams } = useRouter()
  const [mobile, setMobile] = useState<Mobile>('')

  const { mutate: fetchMerchantBasicInfoMutation } = useToastMutation({
    mutationFn (values: {
      mobile: Mobile
    }) {
      return fetchMerchantBasicInfo(values)
    },
    onSuccess (res) {
      // 跳转到列表页
      if (res) {
        navigator.navigate({
          pathname: '/merchant/check-result',
          query: {
            mobile: mobile,
          },
        })
      } else {
        navigator.navigate({
          pathname: '/merchant/create',
          query: {
            mobile: mobile,
          },
        })
      }
    },
  })

  const handleChange = (e) => {
    if (e.length < 12) {
      setMobile(e)
    }
  }

  const fetRegisterInfo = () => {
    if (!mobile) {
      return
    }
    if (!isPhone(mobile.trim())) return Toast.show('请输入正确手机号')
    const params = {
      mobile,
    }
    fetchMerchantBasicInfoMutation(params)
  }

  useEffect(() => {
    const mobile = searchParams.get('mobile') || ''
    if (mobile) {
      setMobile(mobile)
      fetRegisterInfo()
    }
  }, [searchParams])

  return (
    <section className="h-screen w-full overflow-auto bg-[#F2F2F2]">
      <section className="form-wrap mt-2">
        <div className="bg-white p-3 px-3">
          <label className="text-base">
            <span className="text-[#F10505] absolute left-1">*</span>客户手机号
            <Input
              type="text"
              className="mt-1"
              placeholder="输入客户登录手机号"
              value={mobile}
              onChange={e => handleChange(e)}
            />
          </label>
        </div>
        <div className="mt-8 px-2 ">
          <Button
            block
            disabled={(mobile.length < 11 || !mobile)}
            color="primary"
            className="h-12"
            onClick={fetRegisterInfo}
          >
            确定
          </Button>
        </div>

      </section>
    </section>
  )
}
