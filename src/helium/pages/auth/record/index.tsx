import { Divider } from 'antd-mobile'
import { useToastQuery } from '@/common/hooks/react-query'
import { useRouter } from '@/common/hooks/use-router'
import { Loading } from '@/common/components/loading'
import Error from '@/common/components/error'
import { fetchAuthRecordList } from './api'
import Empty from '@/common/components/empty'
import { dayjs } from '@dian/app-utils'
import { IconSVG } from '@/common/components/icon-svg'
import './index.css'

export default function AgentauthRecordList () {
  const { navigator, searchParams } = useRouter()
  const {
    data: authRecordList = [],
    isLoading,
    error,
  } = useToastQuery({
    queryKey: ['fetchAuthRecordList'],
    enabled: !!searchParams.get('merchantId'),
    queryFn () {
      return fetchAuthRecordList({
        merchantId: searchParams.get('merchantId'),
        mchType: searchParams.get('mchType'),
      })
    },
  })

  const goCompanyDetail = (id) => {
    // 跳转详情页面
    navigator.navigate({
      pathname: '/auth/record/detail',
      query: {
        recordId: `${id}`,
      },
    })
  }

  if (isLoading && !!searchParams.get('merchantId')) return <Loading />
  if (error) return <Error text="数据异常" />

  return (
    <section className="h-screen w-full overflow-auto bg-[#F2F2F2] pt-2 pb-16">
      {authRecordList.length > 0
        ? (
          authRecordList &&
        authRecordList.map((item, index) => (
          <div className="flex" key={item.id}>
            <div className="w-8 flex flex-col items-center">
              <div className={`w-2 h-2 mt-1 m-1 rounded-[16px] ${index === 0 ? 'bg-[#0FB269]' : 'bg-[#d8d8d8]'}`} />
              <div className={`w-[1px] flex-grow bg-[#0FB269]  ${index === 0 ? 'bg-[#0FB269]' : 'bg-[#d8d8d8]'}`} />
            </div>

            <div className="box-border flex-grow pr-2 min-w-[240px]">
              <div className="text-[#848484] mb-1.5">{dayjs(item.gmtCreate).format('YYYY-MM-DD')}</div>
              <div className="p-3 rounded-xl bg-white">
                <div className="flex justify-between text-[#1E1E1E] leading-[30px] h-[30px]">
                  <div className="font-medium text-[#1E1E1E]">
                    <div className="inline-block">{item.typeStr}</div>
                    <div
                      className={`name-${item.status} inline-block text-[11px] text-white h-4 leading-4 ml-2 px-1 py-0 rounded-md`}
                    >
                      {item.statusStr}
                    </div>
                    {item.ruleTmpCode === 'AGENT_TEMPLATE_II' && (
                      <div className="inline-block text-[#0073F6] text-[11px] h-4 leading-4 border ml-2 px-1 py-0 rounded-md border-solid border-[#0073F6]">
                        简版
                      </div>
                    )}
                  </div>
                  <div onClick={() => goCompanyDetail(item.id)}>
                    <IconSVG symbol="icon-xianxing_you" className="mb-1 ml-1 text-[#848484]" />
                  </div>
                </div>
                <Divider className="my-1" />
                <div className="flex justify-between text-[#1E1E1E] leading-[30px] min-h-[30px]">
                  <div className="text-[14px] text-[#8D98A9] w-[76px]">认证来源</div>
                  <div className="w-[200px] text-right">{item.originTypeStr}</div>
                </div>
                <div className="flex justify-between text-[#1E1E1E] leading-[30px] min-h-[30px]">
                  <div className="text-[14px] text-[#8D98A9] w-[76px]">认证名称</div>
                  <div className="w-[200px] text-right">{item.name}</div>
                </div>
              </div>
            </div>
          </div>
        ))
        )
        : (
          <Empty text="暂无认证记录数据" />
        )}
    </section>
  )
}
