import { useRouter } from '@dian/app-utils/router'
import { Button, Toast } from 'antd-mobile'
import { usePCLogin } from './api'
import { IconSVG } from '@/common/components/icon-svg'
import { useState } from 'react'
import { cookie } from '@dian/app-utils'

import './index.css'

export default function PCLogin () {
  const { navigator, searchParams } = useRouter()
  const uuid = searchParams.get('uuid')

  const { mutate } = usePCLogin()
  const [loginSuccess, setLoginSuccess] = useState(false)

  function close () {
    navigator.navigate(-1, {
      replace: true,
    })
  }

  function login () {
    if (!uuid) {
      return Toast.show('登录错误：缺少uuid')
    }
    mutate(
      {
        uuid,
        token: cookie.get('newToken'),
        agentEmployeeId: Number(cookie.get('userId')),
      },
      {
        onSuccess () {
          setLoginSuccess(true)
        },
      },
    )
  }

  return (
    <div className="login-wrap bg-white h-screen w-full text-center flex flex-col justify-between pb-[8.4vh]">
      <div>
        <IconSVG symbol="icon-xianxing_dengluqueren" className="mx-auto mb-4" />

        <p className="text-lg">
          {loginSuccess ? '登录成功，请关闭此页' : 'PC端登录确认'}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {!loginSuccess
          ? (
            <>
              <Button block color="primary" onClick={login}>
                登录
              </Button>
              <Button block onClick={close}>
                取消登录
              </Button>
            </>
          )
          : (
            <Button block color="primary" onClick={close}>
              关闭
            </Button>
          )}
      </div>
    </div>
  )
}
