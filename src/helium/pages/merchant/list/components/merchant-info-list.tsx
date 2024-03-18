import type { FC } from 'react'
import React from 'react'
import { InfiniteScroll } from 'antd-mobile'
import MerchantItem from './merchant-info-item'
import { Loading } from '@dian/common/components/loading'
import Empty from '@dian/common/components/empty'

interface IProps {
  dataSource: Record<string, any> | undefined;
  isFetching: boolean;
  isInitialLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  setPageMask: (boolean) => void;
  refetchData: () => void;
}

const MerchantInfoList:FC<IProps> = (props) => {
  const {
    dataSource,
    isFetching,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetchData,
    setPageMask,
  } = props

  return (
    <div className="p-2">
      {
        (dataSource?.pages?.[0]?.list?.length) || isFetching
          ? (
            <div>
              {
                dataSource?.pages
                  .map((page, i) => (
                    <React.Fragment key={i}>
                      {(page?.list || []).map((item, index) => (
                        <MerchantItem
                          key={index} merchantInfo={item}
                          refetchData={refetchData}
                          setPageMask={setPageMask}
                        />
                      ))}
                    </React.Fragment>
                  ))
              }
              {
              isInitialLoading
                ? <div className="mt-8"><Loading /></div>
                : (
                  <InfiniteScroll
                    loadMore={async () => {
                      if (!isFetchingNextPage && hasNextPage) {
                        fetchNextPage()
                      }
                    }}
                    hasMore={hasNextPage || false}
                  />
                )
            }
            </div>
          )
          : (
            <div className="text-center">
              <Empty />
            </div>
          )
      }
    </div>
  )
}

export default MerchantInfoList
