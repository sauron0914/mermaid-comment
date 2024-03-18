import { IconSVG } from '@/common/components/icon-svg'
import { bls } from '@/common/utils/storage'
import { isPhone } from '@/common/utils/varify'
import { isLocalEnv } from '@dian/app-utils'
import { useRouter } from '@dian/app-utils/router'
import { Button, Dialog, Form, Input, Toast } from 'antd-mobile'
import { useState } from 'react'
import { useLogin, useSMSCode } from './api'
import { useInterval } from 'ahooks'

import './index.css'

const COUNTDOWN = isLocalEnv() ? 5 : 60

export default function Login () {
  const { navigator } = useRouter()

  const [form] = Form.useForm()

  const [accountMode, setAccountMode] = useState(false)
  const [count, setCount] = useState(COUNTDOWN)
  const [running, setRunning] = useState(false)
  const [whichButton, setWhichButton] = useState<string>()

  const { mutate: SMSCodeMutate, isLoading: smsCodeLoading } = useSMSCode()
  const { mutate: loginMutate, isLoading: loginLoading } = useLogin()

  const HOLDER_MOBILE = accountMode ? '请输入账号/手机号码' : '请输入手机号码'
  const HOLDER_CORRECT_MOBILE = '手机号码格式有误'
  const HOLDER_SMSCODE = accountMode ? '请输入密码' : '请输入验证码'

  useInterval(
    () => {
      if (count > 1) {
        setCount(count - 1)
      } else {
        setRunning(false)
      }
    },
    running ? 1000 : undefined,
  )

  const handleFetchSMSCode = function () {
    setWhichButton('smsCode')
    const username = form.getFieldValue('username')
    if (!username) return Toast.show(HOLDER_MOBILE)
    if (!isPhone(username)) return Toast.show(HOLDER_CORRECT_MOBILE)

    SMSCodeMutate(
      { username },
      {
        onSuccess () {
          setCount(COUNTDOWN)
          setRunning(true)
          Toast.show('验证码发送成功')
        },
      },
    )
  }

  // 登录
  const handleLogin = function (values: any) {
    setWhichButton('login')
    const { username, password } = values
    if (!username) return Toast.show(HOLDER_MOBILE)
    if (!accountMode && !isPhone(username)) {
      return Toast.show(HOLDER_CORRECT_MOBILE)
    }
    if (!password) return Toast.show(HOLDER_SMSCODE)

    loginMutate(
      { username, password, loginType: accountMode ? 2 : 1 },
      {
        onSuccess ({ username }) {
          bls.set('mobile', username)
          navigator.navigate('/choose-role?from=auto', { replace: true })
        },
      },
    )
  }

  return (
    <div className="login-wrap bg-white box-border h-screen w-full">
      <div className="text-center">
        <IconSVG symbol="icon-xiaodianlogo" className="w-14 h-14" />
        <h2 className="text-xl text-black mt-4 mb-8">欢迎登录电小二</h2>
      </div>
      <Form
        form={form}
        layout="horizontal"
        mode="card"
        className="form-login"
        onFinish={handleLogin}
        footer={
          <Button
            block
            type="submit"
            color="primary"
            size="large"
            className="mt-8 mb-4"
            loading={whichButton === 'login' && loginLoading}
          >
            登录
          </Button>
        }
      >
        <Form.Item name="username" className="bg-gray-50 bg-opacity-90">
          <Input
            type={accountMode ? 'text' : 'tel'}
            placeholder={HOLDER_MOBILE}
            maxLength={accountMode ? undefined : 11}
          />
        </Form.Item>
        <Form.Header />
        <Form.Item
          name="password"
          className="bg-gray-50 bg-opacity-90"
          extra={
            accountMode
              ? (
                <Button
                  color="primary"
                  fill="none"
                  className="p-0 text-base"
                  onClick={() =>
                    Dialog.alert({
                      content: '请找HR或者渠道经理沟通修改！',
                    })}
                >
                  忘记密码
                </Button>
              )
              : (
                <Button
                  color="primary"
                  fill="none"
                  className="p-0 text-base"
                  disabled={running}
                  onClick={handleFetchSMSCode}
                  loading={whichButton === 'smsCode' && smsCodeLoading}
                >
                  {running ? `${count}秒可重发` : '发送验证码'}
                </Button>
              )
          }
        >
          <Input
            autoComplete="off"
            type={accountMode ? 'password' : 'tel'}
            placeholder={HOLDER_SMSCODE}
            maxLength={accountMode ? undefined : 4}
          />
        </Form.Item>
      </Form>
      <Button
        block
        onClick={() => {
          setAccountMode(!accountMode)
          form.resetFields(['password'])
        }}
      >
        {accountMode ? '验证码登录' : '账号密码登录'}
      </Button>
    </div>
  )
}
