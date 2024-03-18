import { useRef } from 'react'
import { useInfiniteQuery } from '@/common/hooks/react-query'
import {
  InfiniteScroll,
  PullToRefresh,
} from 'antd-mobile'
import { toMoney } from '@/common/utils/format'
import { useQueryClient } from '@tanstack/react-query'
import { Loading } from '@/common/components/loading'
import Empty from '../component/empty'
import { useRouter } from '@/common/hooks/use-router'

import { balanceFlowList } from '../api'
import './index.less'

export default function Index () {
  const scrollContainer = useRef<HTMLDivElement>(null)
  const { searchParams } = useRouter()
  const queryChannelId = searchParams.get('queryChannelId')
  const PageSize = 20

  const queryClient = useQueryClient()
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['currentPage'],
    async queryFn ({ pageParam = 1 }) {
      const res = await balanceFlowList({
        queryChannelId,
        pageSize: PageSize,
        pageNo: pageParam,
      })
      if (res?.list?.length === PageSize) {
        return { ...res, nextPageNo: pageParam + 1 }
      }
      return { ...res }
    },
    getNextPageParam: lastPage => lastPage.nextPageNo,
  })

  const InfiniteScrollContent = () => {
    const noMore =
    data?.pages?.[0]?.list?.length === 0
      ? (
        <Empty tip="暂无数据" />
      )
      : (
        <span>没有更多了</span>
      )
    return <>{hasNextPage || isLoading ? <Loading /> : noMore}</>
  }
  return (
    <div className="bg-[#F2F2F2] box-border h-screen w-full overflow-auto pb-16" ref={scrollContainer}>
      <PullToRefresh
        onRefresh={async () => {
          // 处理上拉刷新需要返回第一页的数据
          queryClient.resetQueries({ queryKey: ['currentPage'] })
        }}
      >
        <div className="">
          <>
            {data?.pages?.map((group, key) => {
              return group?.list?.map((item, index) => (
                <div
                  className="paymen-recorde-item"
                  key={key + index}
                >
                  <p className="pt-3">
                    <span
                      className="paymen-recorde-item-title"
                    >{item.title || ''}</span> <span className={`${item.changeAmount > 0 ? 'text-[#F56A07]' : 'text-black'}`}>{item.changeAmount > 0 ? `+${item.changeAmountToCny}` : item.changeAmountToCny}</span>
                  </p>
                  <p className="pb-3 border-0 border-b-[1px] border-solid border-b-[#E8E8E8]">
                    <span>{item.bizDateFormatter}</span>
                    <span>余额 {toMoney(item.postAvailableAmount / 100 || 0)}</span>
                  </p>
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
    </div>
  )
}
