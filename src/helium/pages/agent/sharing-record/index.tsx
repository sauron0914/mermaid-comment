import { Divider, PullToRefresh, InfiniteScroll } from 'antd-mobile'
import { useRouter } from '@/common/hooks/use-router'
import { useInfiniteQuery } from '@/common/hooks/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { Loading } from '@/common/components/loading'
import Error from '@/common/components/error'
import { fetchSharingRecordList } from './api'
import Empty from '@/common/components/empty'
import { dayjs } from '@dian/app-utils'
import { IconSVG } from '@/common/components/icon-svg'
import './index.css'

export default function AgentSharingRecordList () {
  const { searchParams, navigator } = useRouter()
  const queryClient = useQueryClient()

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['currentPage'],
    async queryFn ({ pageParam = 1 }) {
      const res = await fetchSharingRecordList({
        pageSize: 10,
        pageNo: pageParam,
        agentId: searchParams.get('agentId'),
      })
      // 判断是否有下一页
      if (res.length === 10) {
        return { list: [...res], nextPageNo: pageParam + 1 }
      }
      return { list: [...res] }
    },
    getNextPageParam: lastPage => lastPage.nextPageNo,
  })

  const InfiniteScrollContent = () => {
    const noMore =
    data?.pages?.[0]?.list?.length === 0
      ? (
        <Empty text="没有变更记录" />
      )
      : (
        <span>没有更多了</span>
      )
    return <>{hasNextPage || isLoading ? <Loading /> : noMore}</>
  }

  const handleProcessDetail = (item) => {
    navigator.href('indra', {
      pathname: '/task-new-detail',
      query: {
        businessId: item.businessId,
        processInstanceId: item.processId,
      },
    })
  }

  if (isLoading && !!searchParams.get('agentId')) return <Loading />
  if (error) return <Error text="数据异常" />

  return (
    <section className="h-screen w-full overflow-auto bg-[#F2F2F2] pt-2 pb-16">
      <PullToRefresh
        onRefresh={async () => {
          // 处理上拉刷新需要返回第一页的数据
          queryClient.resetQueries({ queryKey: ['currentPage'] })
        }}
      >
        <div className="p-2">
          <>
            {data?.pages.map((group, num) => {
              return group.list.map((item, index) => (
                <div className="flex" key={item.time + index + num}>
                  <div className="w-8 flex flex-col items-center">
                    <div className={`w-2 h-2 mt-1 m-1 rounded-[16px] ${(index + num) === 0 ? 'bg-[#0FB269]' : 'bg-[#d8d8d8]'}`} />
                    <div className={`w-[1px] flex-grow bg-[#0FB269]  ${(index + num) === 0 ? 'bg-[#0FB269]' : 'bg-[#d8d8d8]'}`} />
                  </div>
                  <div className="box-border flex-grow pr-2 min-w-[240px]">
                    <div className="text-[#848484] mb-1.5">{dayjs(item.gmtCreate).format('YYYY-MM-DD')}</div>
                    <div className="p-3 rounded-xl bg-white mb-1">
                      <div className="flex justify-between text-[#1E1E1E] leading-[30px] h-[30px]">
                        <div className="font-medium text-[#1E1E1E]">
                          <div className="inline-block">分成变更</div>
                          <div
                            className={`name-${item.status} inline-block text-[11px] text-white h-4 leading-4 ml-2 px-1 py-0 rounded-md`}
                          >
                            {item.statusStr}
                          </div>
                        </div>
                        {
                          item.processId && <div onClick={() => handleProcessDetail(item)}>
                            <IconSVG symbol="icon-xianxing_you" className="mb-1 ml-1 text-[#848484]" />
                          </div>
                        }
                      </div>
                      <Divider className="my-1" />
                      <div className="flex justify-between text-[#1E1E1E] leading-[30px] min-h-[30px]">
                        <div className="text-[14px] text-[#8D98A9] w-[106px]">{item.beforeFeeRate || 0}% ➞ <span className="text-[#1E1E1E]">{item.afterFeeRate || 0}%</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            })}
            <InfiniteScroll
              loadMore={() => fetchNextPage() as Promise<any>}
              hasMore={!!hasNextPage && !isFetchingNextPage}
            >
              <InfiniteScrollContent />
            </InfiniteScroll>
          </>
        </div>
      </PullToRefresh>
    </section>
  )
}
