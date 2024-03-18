import { Card } from 'antd-mobile'
import { useRouter } from '@/common/hooks/use-router'

const AuthGuidePage = () => {
  const { searchParams, navigator } = useRouter()
  const url = searchParams.get('url') || ''
  const type = searchParams.get('type') || ''
  const mobile = searchParams.get('mobile') || ''

  //   const location = useLocation()
  //   const { mobile, url, type } = queryString.parse(location.search)
  function handleGoCreate () {
    const backUrl = location.pathname + location.search
    if (url) {
      navigator.navigate({
        pathname: '/merchant/check', // url
        query: {
          type: `${type}`,
        },
      })
      // router.push({
      //   pathname: url,
      //   query: {
      //     type,
      //   },
      // })
    } else {
      navigator.navigate({
        pathname: '/merchant/check',
        query: {
          mobile,
          backUrl,
        },
      })
      // router.push({
      //   pathname: '/crm/customer/create/form-create',
      //   query: {
      //     mobile,
      //     backUrl,
      //   },
      // })
    }
  }

  return (
    <div className="p-2">
      <Card title="商户微信扫码注册" className="pb-2">
        <p>商户打开微信，扫描二维码，直接进入注册流程</p>
        <img src="//fed.dian.so/image/1624263883259.png" className="w-[156px]" />
      </Card>
      <Card title="小电商家小程序注册" className="pb-2">
        <div className="py-2">
          <span className="inline-block w-5 h-5 bg-[#0FB269] text-xs text-white text-center leading-5 mr-2.5 rounded-[100%]">01</span>
          <span>商户打开微信，找到小电商家，点击进入</span>
        </div>
        <img src="//fed.dian.so/image/1624265100334.png" />
        <div className="py-2">
          <span className="inline-block w-5 h-5 bg-[#0FB269] text-xs text-white text-center leading-5 mr-2.5 rounded-[100%]">02</span>
          <span>进入登录页面，点击“立即注册”</span>
        </div>
        <img src="//fed.dian.so/image/e1900136a3d598558a607c5a5570851b.png" />
        <div className="py-2">
          <span className="inline-block w-5 h-5 bg-[#0FB269] text-xs text-white text-center leading-5 mr-2.5 rounded-[100%]">03</span>
          <span>进入注册页面，填入相关信息进行注册</span>
        </div>
        <img src="//fed.dian.so/image/95ee4e66356120a06d9875b32cc98d9d.png" />
      </Card>
      <Card title="其他认证方式" className="pb-2">
        <p>电小二端新建商户入口：<span className="text-[#0FB269]" onClick={handleGoCreate}>新建商户</span></p>
      </Card>
    </div>
  )
}

export default AuthGuidePage
