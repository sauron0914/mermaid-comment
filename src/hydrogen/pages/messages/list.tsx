import { useEffect } from 'react'
import { useRouter } from '@dian/app-utils/router'
import { dayjs } from '@dian/app-utils'
import { href } from '@dian/app-utils/href'
import { Card, InfiniteScroll, PullToRefresh, Toast } from 'antd-mobile'
import { useInfiniteQuery } from '@dian/common/hooks/react-query'
import Error from '@dian/common/components/error'
import { Loading } from '@/common/components/loading'
import { IconSVG } from '@/common/components/icon-svg'
import Empty, { EmptyType } from '@/common/components/empty'
import type { BizTypeMessageResponse } from './api'
import { fetchMessageTypeList } from './api'

const MessageList = () => {
  const { searchParams, params } = useRouter()
  const title = searchParams.get('title') ?? '消息列表'
  const { bizTypeCode } = params

  const {
    data: messageTypeResponse,
    isRefetching,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<BizTypeMessageResponse, Error>({
    queryKey: ['fetchMessageTypeList', bizTypeCode],
    async queryFn ({ pageParam = 1 }) {
      const data = await fetchMessageTypeList({
        bizTypeCode,
        page: pageParam,
        pageSize: 10,
      })
      if (data.hasMore) {
        return { ...data, nextPage: pageParam + 1 }
      }
      return data
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const typeMessageList = messageTypeResponse?.pages?.[0].list ?? []

  const InfiniteScrollContent = () => {
    const noMore =
    typeMessageList?.length === 0
      ? (
        <div className="h-[calc(100vh_-_4.5rem)] flex flex-col justify-center">
          <Empty type={EmptyType.NoData} text="暂无消息" />
        </div>
      )
      : (
        <span>没有更多了</span>
      )
    return <>{hasNextPage || isLoading ? <Loading className="h-screen items-center" /> : noMore}</>
  }

  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])
  if (isRefetching) return <Loading className="h-screen items-center" />
  if (error) return <Error text={error?.message} />

  return (
    <div className="bg-[#F5F5F5]  h-full min-h-screen p-4 space-y-3">
      <PullToRefresh
        onRefresh={async () => {
          refetch()
        }}
      >
        {
          typeMessageList.map(({
            updateTime,
            subject,
            content,
            actionUrl,
          }, index) => (
            <div key={index} className="mb-3">
              <div className="text-center text-[#B0B0B0] mb-2">{dayjs(Number(updateTime)).format('YYYY-MM-DD HH:mm')}</div>
              <Card>
                <div className="text-[#1E1E1E] text-base mb-1">{subject}</div>
                <div className="text-[#585858] text-sm">{content}</div>
                {
                  actionUrl && (
                    <>
                      <div className="h-px bg-[#E8E8E8] scale-y-50 my-2" />
                      <div
                        className="flex justify-between items-center"
                        onClick={() => href('global', actionUrl as `/${string}`)}
                      >
                        <a>查看详情</a>
                        <IconSVG symbol="icon-xianxing_you" className="text-[color:var(--adm-color-primary)] w-4 h-4" />
                      </div>
                    </>
                  )
                }
              </Card>
            </div>
          ))
        }
        <InfiniteScroll
          loadMore={() => (fetchNextPage() as unknown as Promise<void>)}
          hasMore={!!hasNextPage && !isFetchingNextPage}
        >
          <InfiniteScrollContent />
        </InfiniteScroll>
      </PullToRefresh>
    </div>
  )
}

export default MessageList
