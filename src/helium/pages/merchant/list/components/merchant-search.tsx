import type { FC } from 'react'
import { useState, useEffect, useRef, useContext } from 'react'
import { Toast, Tabs, SearchBar, Button, PullToRefresh } from 'antd-mobile'
import Empty from '@dian/common/components/empty'
// eslint-disable-next-line import/no-unresolved
import { useRouter } from '@dian/app-utils/router'
import classNames from 'classnames'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { getMerchantList } from '../api'
import MerchantInfoList from './merchant-info-list'
import { MerchantListContext } from '../context'
import { isHonor } from '@/common/utils/env'

const LIMIT = 10

interface IProps {
  onCancel: () => void;
  setPageMask: (boolean) => void;
}

const queryMap = {
  1: 'contactPhone',
  2: 'merchantId',
  3: 'name',
}
const MerchantSearch:FC<IProps> = ({ onCancel, setPageMask }) => {
  const { navigator, searchParams, setSearchParams } = useRouter()
  const { merchantListPermissions } = useContext(MerchantListContext)
  const queryClient = useQueryClient()

  // 受控组件的值。解决初始值
  const [searchBarValue, setSearchBarValue] = useState(searchParams.get('searchText') || '')
  // 确定搜索的值
  const [searchText, setSearchText] = useState(searchParams.get('searchText') || '')
  const [searchType, setSearchType] = useState(searchParams.get('searchType') || '1')
  const [searched, setSearched] = useState(false)

  const ref = useRef()

  useEffect(() => {
    // 如果不存在初始值，则聚焦
    if (!searchText) {
      ref.current?.focus()
    } else {
      setSearchParams({
        searchText,
        searchType,
        search: 'true',
      }, { replace: true })
    }
  }, [])

  // 获取商户列表
  const {
    data: merchantList,
    isFetching,
    isFetchingNextPage,
    isInitialLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['merchant_search_list', searchText, searchType],
    async queryFn ({ pageParam = 0 }) {
      const param = {
        offset: pageParam ? (pageParam - 1) * LIMIT : pageParam,
        pageSize: LIMIT,
      }
      param[queryMap[searchType]] = searchText.trim()
      if (searchType === '2' && searchText && !/^\d+$/.test(searchText.trim())) {
        return Toast.show('请输入正确的商户ID')
      }
      const res = await getMerchantList(param)
      return res
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
    enabled: !!searchText,
    cacheTime: 10 * 60 * 1000,
  })

  useEffect(() => {
    if (merchantList && !searched) {
      setSearched(true)
    }
  }, [merchantList, searched])

  useEffect(() => {
    if (searchText && searchType) {
      setSearchParams({
        searchText,
        searchType,
        search: 'true',
      }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }, [searchText, searchType])

  return (
    <div className="merchant-list-search">
      <div className={classNames(['fixed top-0 z-[1] w-full'])}>
        <div className="px-3 bg-white pt-2">
          <SearchBar
            placeholder="请输入内容"
            showCancelButton={() => true}
            onCancel={() => {
              onCancel()
              // // 清空当前搜索条件
              // setSearchParams()
            }}
            onBlur={(e) => {
              setSearchText(e.target.value?.trim())
            }}
            onSearch={setSearchText}
            onChange={setSearchBarValue}
            value={searchBarValue}
            ref={ref}
          />
        </div>

        <Tabs
          className="bg-white"
          style={{ '--active-line-height': '2px', '--title-font-size': '14px' }}
          defaultActiveKey={searchType}
          onChange={(key) => {
            window.scrollTo({ top: 0 })
            setSearchType(key)
          }}
        >
          {/* <Tabs.Tab title="全部" key="0" className="w-full p-0" /> */}
          <Tabs.Tab title="手机号" key="1" className="w-full p-0" />
          <Tabs.Tab title="商户ID" key="2" className="w-full p-0" />
          <Tabs.Tab title="商户名称" key="3" className="w-full p-0" />
        </Tabs>

        <div className="text-[#848484] bg-[#F2F2F2] py-1 px-3">
          共 <span className="text-[#0FB269]">{merchantList?.pages[0]?.total || 0}</span> 条
        </div>
      </div>

      <div
        className={classNames('pt-[110px]')}
      >
        {
          // 有数据 || 数据在加载过程中展示
          (merchantList?.pages?.[0]?.list?.length) || isFetching
            ? (
              <PullToRefresh
                onRefresh={async () => {
                  queryClient.resetQueries({
                    predicate: query =>
                      query.queryKey[0] === 'merchant_search_list',
                  })
                }}
              >
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
            )
            : (
              <div className="text-center">
                <Empty />
                {
                  // 针对代理商才会有相关操作 && 还未进行搜索不展示
                  searched && merchantListPermissions['1.2.5.2'] && (
                    <div className="px-16 space-y-6">
                      <Button
                        block color="primary" size="large" onClick={() => {
                          if (isHonor) {
                            navigator.navigate({ pathname: '/merchant/guide' })
                          } else {
                            navigator.navigate({ pathname: '/merchant/check' })
                          }
                        }}
                      >新建商户</Button>
                    </div>
                  )
                }
              </div>
            )
        }
      </div>
    </div>
  )
}

export default MerchantSearch
