import { useState } from 'react'
import { useInfiniteQuery, useToastQuery } from '@/common/hooks/react-query'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { omitBy } from 'lodash'
import {
  SearchBar,
  Toast,
  PullToRefresh,
  Mask,
  Switch,
  Button,
} from 'antd-mobile'
import { Loading } from '@/common/components/loading'
import Error from '@/common/components/error'
import { MERCHANT_LIST_AUTH } from '@/common/constants/index'
import MerchantSearch from './components/merchant-search'
import { flushSync } from 'react-dom'
import { MerchantListContext } from './context'
import { useRouter } from '@/common/hooks/use-router'
import MerchantInfoList from './components/merchant-info-list'
import CustomerServiceBubble from '@/common/components/customer-service-bubble'

import {
  fetchPageOperatorAuthority,
  getMerchantList,
} from './api'

import './index.css'
import { isHonor } from '@/common/utils/env'

const LIMIT = 10
export default function AgentList () {
  const { navigator, searchParams, setSearchParams } = useRouter()
  const [searching, setSearching] = useState(!!searchParams.get('search'))
  const [scrollTop, setScrollTop] = useState(0)
  const [pageMask, setPageMask] = useState(false)

  const [filterParams, setFilterParams] = useState<Record<string, any>>({
    onlyMine: searchParams.get('onlyMine') === 'true',
  })

  const setQuery = () => {
    const { onlyMine } = filterParams
    // 过滤 undefined
    const query = omitBy(
      {
        onlyMine: onlyMine,
      }, value => value === undefined,
    )
    // 更新 url query
    setSearchParams(query, { replace: true })
  }

  const queryClient = useQueryClient()

  // 获取商户列表
  const {
    data: merchantList,
    isFetching,
    isFetchingNextPage,
    isInitialLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['merchant_list', filterParams],
    async queryFn ({ pageParam = 0 }) {
      const merchantList = await getMerchantList({
        offset: pageParam ? (pageParam - 1) * LIMIT : pageParam,
        pageSize: LIMIT,
        ...filterParams,
      })

      return merchantList
    },
    getNextPageParam (lastPage, allPages) {
      if (lastPage.hasMore) {
        return allPages.length + 1
      }
      return undefined
    },
    onError (err: any) {
      Toast.show(err?.message || err?.msg || '未知错误')
    },
    cacheTime: 10 * 60 * 1000,
  })

  // 获取权限
  const { data: merchantListPermissions = {}, isLoading: authLoading } = useToastQuery({
    queryKey: ['merchant_permission'],
    queryFn: () =>
      fetchPageOperatorAuthority({
        resCodeList: Object.keys(MERCHANT_LIST_AUTH),
      }),
    cacheTime: 10 * 60 * 1000,
  })

  if (authLoading && isLoading) return <Loading />
  if (error) return <Error text="数据异常" />

  return (
    <MerchantListContext.Provider
      value={{ merchantListPermissions }}
    >
      <div
        className="bg-[#F2F2F2] box-border min-h-screen w-full overflow-auto pb-16"
      >
        <div className="fixed top-0 z-[3] w-full">
          <div className={classNames(['bg-white p-2 px-3', { hidden: searching }])}>
            <SearchBar
              placeholder="请输入手机号、商户ID、商户名称"
              onFocus={() => {
                setScrollTop(document.body.scrollTop ||
                document.documentElement.scrollTop)
                setSearching(true)
              }}
            />
          </div>
          <div className={classNames(['w-full flex justify-between px-3 py-2 bg-[#F2F2F2]', { hidden: searching }])}>
            <div className="text-[#848484]">
              共 <span className="text-[#0FB269]">{merchantList?.pages[0]?.total || 0}</span> 条
            </div>
            <div className="flex justify-between items-center text-[#848484]">
              <span className="mr-2">只看我的</span>
              <Switch
                checked={filterParams.onlyMine} style={{
                  '--height': '18px',
                  '--width': '32px',
                  zIndex: '1',
                }}
                onChange={
                  (v) => {
                    setSearchParams({ onlyMine: `${v}` }, { replace: true })
                    setFilterParams({
                      ...filterParams,
                      onlyMine: v,
                    })
                  }
                }
              />
            </div>
          </div>
        </div>

        <div
          className={
          classNames(['pt-[80px]', {
            hidden: searching,
          }])
        }
        >
          <PullToRefresh
            onRefresh={async () => {
              queryClient.resetQueries({
                predicate: query =>
                  query.queryKey[0] === 'merchant_list',
              })
            }}
          >
            {/* <div>商户列表</div> */}
            <MerchantInfoList
              dataSource={merchantList}
              isFetching={isFetching}
              isInitialLoading={isInitialLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              refetchData={refetch}
              setPageMask={setPageMask}
            />
          </PullToRefresh>
        </div>

        {searching && (
          <MerchantSearch
            onCancel={() => {
              setQuery()
              flushSync(() => {
                setSearching(false)
              })
              window.scrollTo({ top: scrollTop })
            }}
            setPageMask={setPageMask}
          />
        )}

        <Mask visible={pageMask} destroyOnClose color="white" className="flex justify-center items-center"><Loading /></Mask>

        {
        !searching && merchantListPermissions['1.2.5.2'] && <div className="fixed bottom-0 w-full p-2 bg-white">
          <Button
            color="primary"
            onClick={() => {
              if (isHonor) {
                navigator.navigate({ pathname: '/merchant/guide' })
              } else {
                navigator.navigate({ pathname: '/merchant/check' })
              }
            }}
            block
            className="btn-item h-[48px]"
          >
            新建商户
          </Button>
        </div>
}

      </div>
      <CustomerServiceBubble />
    </MerchantListContext.Provider>
  )
}
