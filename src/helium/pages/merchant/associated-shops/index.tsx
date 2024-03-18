import { useInfiniteQuery } from '@tanstack/react-query'
import { Card, InfiniteScroll, Tag } from 'antd-mobile'
import { fetchAssociatedShopsApi } from './api'
import { useRouter } from '@/common/hooks/use-router'
import Empty from '@/common/components/empty'
import { Loading } from '@/common/components/loading'
import Error from '@/common/components/error'

const PageSize = 10

export const AssociatedShops = () => {
  const { searchParams } = useRouter()

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['currentPage'],
    async queryFn ({ pageParam = 1 }) {
      const res = await fetchAssociatedShopsApi({
        pageSize: PageSize,
        pageNo: pageParam,
        merchantId: Number(searchParams.get('merchantId')),
      })
      if (res.list.length === PageSize) {
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
        <Empty title="暂无门店" />
      )
      : (
        <span>没有更多了</span>
      )
    return <>{hasNextPage || isLoading ? <Loading /> : noMore}</>
  }
  if (isLoading) return <Loading />
  if (error) return <Error text={(error as any).msg ?? '数据异常'} />
  return (
    <div className="h-screen w-full overflow-auto bg-[#F2F2F2] p-2">
      <p className="mb-2">共查询到 <span className="text-[#0FB269]">{data?.pages[0].total}</span> 家门店</p>
      {
        data?.pages?.map((group) => {
          return group.list.map(item => (
            <Card
              key={item.shopId}
              title={<span>{item.shopName} </span>}
              extra={<Tag
                color={`${item.status === 4 ? '#DAF2E3' : '#FFF4E6'}`}
                style={{ '--border-radius': '4px', '--text-color': item.status === 4 ? '#0FB269' : '#F56A07' }}
              >{item.shopStatusStr}</Tag>}
              className="mb-2"
              headerClassName="border-[#efefef]"
            >
              业务： {item.sellerName}
            </Card>
          ))
        })
      }
      <InfiniteScroll
        loadMore={() => fetchNextPage() as Promise<any>}
        hasMore={!!hasNextPage && !isFetchingNextPage}
      >
        <InfiniteScrollContent />
      </InfiniteScroll>
    </div>
  )
}

export default AssociatedShops
