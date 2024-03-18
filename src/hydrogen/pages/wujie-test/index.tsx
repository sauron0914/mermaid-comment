import { Button, Toast, Modal } from 'antd-mobile'
import { uploadImages, getLocation, showNavigation, scanQRCode } from '@dian/bridge'
import { useRouter } from '@dian/app-utils/router'

const WujieTest = () => {
  const { navigator, params, searchParams } = useRouter()
  const { id } = params
  const from = searchParams.get('from')

  // 上传附件
  const handleClickUpload = () => {
    uploadImages({ maxCount: 9, onlyCamera: false }, (response) => {
      if (
        !response.success ||
        response.error ||
        response.data?.length === 0
      ) {
        return Toast.show('上传失败')
      }
      Modal.alert({
        title: '上传成功',
        content: response.data,
      })
    })
  }
  // 获取位置
  const getCurLocation = () => {
    getLocation((res) => {
      if (!res.success) {
        Toast.show('位置获取失败，请开启定位服务')
      } else if (res.data?.split(',')?.length) {
        const [latitude, longitude] = res.data.split(',')
        Modal.alert({
          title: '位置获取成功',
          content: `${longitude}, ${latitude}`,
        })
      }
    })
  }

  // 扫一扫
  const scanCode = (cb, params: any = {}) => {
    scanQRCode((res) => {
      cb(res)
    }, params)
  }
  const handlePageScanCode = () => {
    scanCode(
      async (res) => {
        if (res.success) {
          const { code: deviceNo } = res.data
          Toast.show(`扫码成功: ${deviceNo}`)
        } else {
          Toast.show('扫码失败，请重试')
        }
      },
      { needDetail: true },
    )
  }

  // 是否显示底部导航
  const handleShowNav = (bool) => {
    showNavigation({ show: bool }, (res) => {
      if (res.success) {
        Toast.show(`${bool ? '显示成功' : '隐藏成功'}`)
      } else {
        Toast.show('调用bridge失败')
      }
    })
  }
  return (
    <div className="mt-10 m-5">
      我是hydrogen，获取路由参数id={id},from={from}
      <Button
        color="primary" block size="large"
        className="mt-3"
        onClick={() => {
          // navigator.href('honor', {
          //   pathname: '/wujie-test',
          //   query: {
          //     from: 'hydrogen',
          //   },
          // })
          window.location.replace('/wujie-test?from=hydrogen')
        }}
      >
        跳转至honor-replace1
      </Button>
      <Button
        color="primary" block size="large"
        className="mt-3"
        onClick={() => {
          navigator.href('honor', {
            pathname: '/wujie-test',
            query: {
              from: 'hydrogen',
            },
          }, { replace: true })
        }}
      >
        跳转至honor-replace2
      </Button>
      <Button
        color="primary" block size="large"
        className="mt-3"
        onClick={() => {
          navigator.href('honor', '/wujie-test', { replace: true })
        }}
      >
        跳转至honor-replace3
      </Button>
      <Button
        color="primary" block size="large"
        className="mt-3 mb-3"
        onClick={() => {
          navigator.across('helium', '/wujie-test/2222')
        }}
      >
        跳转至helium
      </Button>
      <Button
        color="primary" block size="large"
        className="mt-3 mb-3"
        onClick={() => {
          navigator.across('lithium', {
            pathname: '/wujie-test/2222',
            query: {
              from: 'hydrogen',
            },
          })
        }}
      >
        跳转至lithium
      </Button>

      测试bridge：
      <Button
        color="primary" block size="large"
        className="mb-3"
        onClick={handleClickUpload}
      >
        上传附件
      </Button>
      <Button
        color="primary" block size="large"
        className="mb-3"
        onClick={getCurLocation}
      >
        获取位置
      </Button>
      <Button
        color="primary" block size="large"
        className="mb-3"
        onClick={handlePageScanCode}
      >
        扫一扫
      </Button>
      <Button
        color="primary" size="large"
        className="mb-3 mr-3"
        onClick={() => { handleShowNav(true) }}
      >
        显示底部导航
      </Button>
      <Button
        color="primary" size="large"
        className="mb-3"
        onClick={() => { handleShowNav(false) }}
      >
        隐藏底部导航
      </Button>
      <Button
        color="primary" size="large"
        className="mb-3"
        onClick={() => {
          throw new Error('This Is A Test Error')
        }}
      >
        sentry-report
      </Button>
    </div>
  )
}

export default WujieTest
