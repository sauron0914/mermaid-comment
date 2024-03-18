import { useRef } from 'react'
import { useInfiniteQuery } from '@/common/hooks/react-query'

import {
  InfiniteScroll,
  PullToRefresh,
} from 'antd-mobile'
import { Loading } from '@/common/components/loading'
import Empty from '../component/empty'
import { useRouter } from '@/common/hooks/use-router'
import { useQueryClient } from '@tanstack/react-query'

import { listWithdrawApply } from '../api'

import Item from './item'

export default function Index () {
  const scrollContainer = useRef<HTMLDivElement>(null)

  const PageSize = 20

  const { searchParams } = useRouter()
  const queryChannelId = searchParams.get('queryChannelId')

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
      const res = await listWithdrawApply({
        queryChannelId,
        pageSize: PageSize,
        pageNo: pageParam,
      })

      if (res?.data?.length === PageSize) {
        return { list: res?.data, nextPageNo: pageParam + 1 }
      }
      return { list: res?.data }
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
                <Item
                  data={item}
                  key={index + key}
                />

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
