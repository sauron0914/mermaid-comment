import { Button, Toast } from 'antd-mobile'
import { IconSVG } from '@/common/components/icon-svg'
import './index.css'
import { scanQRCode } from '@dian/bridge'

export default function PCLogin () {
  function scan () {
    scanQRCode((res) => {
      if (!res.success) {
        Toast.show('扫码失败，请重试')
        return
      }
      if (res.data) {
        const link = res.data as string
        if (link.includes('/pc-login')) {
          window.location.href = link
        } else {
          Toast.show('登陆二维码错误，请刷新二维码页面重新尝试')
        }
      }
    }, {})
  }

  return (
    <div className="login-wrap bg-white h-screen w-full text-center flex flex-col justify-between pb-[8.4vh]">
      <div>
        <IconSVG symbol="icon-xianxing_dengluqueren" className="mx-auto mb-4" />

        <p className="text-lg">扫码登录PC端</p>
      </div>
      <div className="flex flex-col gap-4">
        <Button block color="primary" onClick={scan}>
          扫码登录
        </Button>
      </div>
    </div>
  )
}
