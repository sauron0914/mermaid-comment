import type { ReactNode, ReactElement } from 'react'
import { useState, useRef, useEffect } from 'react'
import { useInfiniteQuery, useToastQuery, useToastMutation } from '@/common/hooks/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { isNumber } from 'lodash'
import {
  SearchBar,
  Card,
  Tag,
  Button,
  Toast,
  InfiniteScroll,
  Dialog,
  PullToRefresh,
} from 'antd-mobile'
import {
  PaperContent,
  PaperFooter,
  PaperFooterModal,
} from '@/common/components/paper'
import { Loading } from '@/common/components/loading'
import { IconSVG } from '@/common/components/icon-svg'
import Empty from './components/empty'
import Error from '@/common/components/error'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AGENT_LIST_AUTH } from '@/common/constants/index'
import CustomerServiceBubble from '@/common/components/customer-service-bubble'

import {
  fetchAgentCustomerList,
  fetchPageOperatorAuthority,
  fetchAgentIsPerson,
  fetchAgentIsCreateGray,
  checkAgentFeeRateExits,
} from './api'

import './index.css'
import { useRouter } from '@/common/hooks/use-router'
import { getUserAgentId } from '@/common/utils/cookie'

interface FieldContent {
  label: string | ReactNode;
  value: ReactNode;
  hide?: boolean;
  onClick?: () => void;
}

interface FooterContent {
  label: string;
  hide?: boolean;
  onClick?: () => void;
  fill?: any;
  popupModal?: ReactElement;
}

// agentStr = '待认证'
// agentStatus = 1
// agentStr = '待签约'
// agentStatus = 2
// agentStr = '已冻结'
// agentStatus = 3

const isAgent = getUserAgentId() > 3

export default function AgentList () {
  const [keyWord, setKeyWord] = useState<string | null>()
  const [feeRateParams, setFeeRateData] = useState<{agentId: string, feeRate: string}>()

  const { navigator } = useRouter()
  const scrollContainer = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const PageSize = 10

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['currentPage', keyWord],
    async queryFn ({ pageParam = 1 }) {
      const res = await fetchAgentCustomerList({
        pageSize: PageSize,
        pageNo: pageParam,
        keyWord,
      })
      if (res.list.length === PageSize) {
        return { ...res, nextPageNo: pageParam + 1 }
      }
      return { ...res }
    },
    getNextPageParam: lastPage => lastPage.nextPageNo,
  })

  // 获取权限
  const { data: authorityData, isLoading: authLoading } = useToastQuery({
    queryKey: ['fetchAgentListAuthority'],
    queryFn: () =>
      fetchPageOperatorAuthority({
        resCodeList: Object.keys(AGENT_LIST_AUTH),
      }),
  })

  const { data: isPersonAgent } = useToastQuery({
    queryKey: ['fetchAgentIsPerson'],
    queryFn: fetchAgentIsPerson,
  })

  const { data: hasCreateGray } = useToastQuery({
    queryKey: ['fetchAgentIsCreateGray'],
    queryFn: fetchAgentIsCreateGray,
  })

  const { mutate: checkAgentFeeRateExitsMutate, data: feeInfo } = useToastMutation({
    mutationFn: checkAgentFeeRateExits,
  })

  useEffect(() => {
    if (feeInfo?.exist === false && feeRateParams) {
      navigator.navigate({
        pathname: '/agent/change-sharing',
        query: {
          agentId: feeRateParams.agentId,
          feeRate: feeRateParams.feeRate,
        },
      })
    }

    if (feeInfo?.exist === true && feeRateParams) {
      Dialog.confirm({
        header: '温馨提示',
        content: (
          <div
            style={{ color: '#585858', fontSize: '14px', textAlign: 'center' }}
          >您有一个变更分成的申请正在审批中，流程ID：{feeInfo.processId || ''},
            如需重新变更，可以撤回该流程或者等该流程审批结束后重新发起！
          </div>
        ),
        closeOnMaskClick: true,
        cancelText: <span className="text-[#585858]">取消</span>,
        confirmText: '查看审批',
        onConfirm () {
          navigator.href('indra', {
            pathname: '/task-new-detail',
            query: {
              businessId: feeRateParams.agentId,
              processInstanceId: feeInfo.processId,
            },
          })
        },
      })
    }
  }, [feeInfo, feeRateParams, navigator])

  const contentFields = (item): FieldContent[] => {
    const res: FieldContent[] = [
      {
        label: '代理商ID',
        value: (
          <CopyToClipboard
            text={item.agentId}
            onCopy={() => {
              Toast.show('复制成功')
            }}
          >
            <span
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {item.agentId}
              <IconSVG
                symbol="icon-xianxing_fuzhi"
                className="text-[#0FB269]"
              />
            </span>
          </CopyToClipboard>
        ),
      },
      {
        label: '客户经理',
        value: item.managerName,
      },
    ]
    return res.filter(i => !i.hide)
  }

  const handleDetail = (id: number) => {
    navigator.navigate({ pathname: `/agent/${id}/detail` })
  }

  const InfiniteScrollContent = () => {
    const noMore =
    data?.pages?.[0]?.list?.length === 0
      ? (
        <Empty tip="暂无代理商" />
      )
      : (
        <span>没有更多了</span>
      )
    return <>{hasNextPage || isLoading ? <Loading /> : noMore}</>
  }

  // 搜索的时候滚动到顶部，防止触发翻页
  const scrollTop = () => {
    if (!scrollContainer.current) return
    if (typeof scrollContainer.current.scrollTo === 'function') {
      scrollContainer.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } else {
      scrollContainer.current.scrollTop = 100
    }
  }

  function renderConfirm (item, bizType) {
    if (!item.isAuth) {
      Dialog.confirm({
        header: <h2 className="text-[20px] text-[#1E1E1E]">提示</h2>,
        content: '代理商未认证，请先认证',
        confirmText: '去认证',
        cancelText: <span className="text-[#848484]">取消</span>,
        onConfirm () {
          navigator.href('honor', {
            pathname: `/crm/customer-agent/${item.agentId}/auth-edit`,
            query: {
              name: `${item.name}`,
              authType: `${item.addAuthType}`,
            },
          })
        },
      })
    } else {
      navigator.href('honor', {
        pathname: '/merchant/sign-contract/agent-submit-apply',
        query: {
          agentId: `${item.agentId}`,
          bizType: `${bizType}`,
          from: '2',
        },
      })
    }
  }

  function renderButton (item) {
    // 当前登录账号属于代理商签约
    if (isAgent) {
      return [{
        label: '新签二级代理商合同',
        key: 1,
        onClick () {
          navigator.href('honor',
            {
              pathname: '/merchant/sign-contract/agent-submit-apply',
              query: {
                agentId: `${item.agentId}`,
                bizType: '12',
                from: '2',
              },
            })
        },
      }]
    }
    // 当前登录账号属于直营签约
    return [
      {
        label: '新签代理商合同',
        key: 1,
        onClick () {
          renderConfirm(item, 7)
        },
      },
      {
        label: '售信协议签约',
        key: 2,
        onClick () {
          renderConfirm(item, 11)
        },
      },
      {
        label: '售宝协议签约',
        key: 3,
        onClick () {
          renderConfirm(item, 10)
        },
      },
      {
        label: '大型连锁代签协议',
        key: 3,
        onClick () {
          renderConfirm(item, 13)
        },
      },
      {
        label: '已签约补充协议签约',
        key: 4,
        onClick () {
          renderConfirm(item, 6)
        },
      },
      {
        label: '设备回收签约',
        key: 5,
        onClick () {
          renderConfirm(item, 8)
        },
      },
    ]
  }

  const footBtnFields = (item): FooterContent[] => {
    const res: FooterContent[] = [
      {
        label: '添加认证',
        fill: 'solid',
        onClick () {
          navigator.href('honor', {
            pathname: `/crm/customer-agent/${item.agentId}/auth-edit`,
            query: {
              name: `${item.name}`,
              authType: `${item.addAuthType}`,
            },
          })
        },
        hide: item.authInfo || !authorityData?.[AGENT_LIST_AUTH['1.2.1.4']] || !item.manageBelongOwn, // 有认证信息的不展示认证 authInfo判断是否展示认证
      },
      {
        label: '分配',
        fill: 'outline',
        onClick () {
          navigator.href('honor', {
            pathname: '/crm/customer/assign',
            query: {
              id: `${item.id}`,
              type: 'agent',
              oldAgent: `${item.agentId}`,
              from: 'agentList',
            },
          })
        },
        hide: !authorityData?.[AGENT_LIST_AUTH['1.2.1.2']],
      },
      {
        label: '变更分成',
        fill: 'solid',
        onClick () {
          checkAgentFeeRateExitsMutate({
            agentId: item.agentId,
          })
          setFeeRateData(item)
        },
        hide: !authorityData?.[AGENT_LIST_AUTH['1.2.1.6']] || item.agentStatus !== 2 || !item.isSign,
      },
      {
        // 直营签约
        label: '签约',
        fill: 'outline',
        hide:
          !authorityData?.[AGENT_LIST_AUTH['1.2.1.5']] ||
          !item.manageBelongOwn ||
          !item.isAuth,
        popupModal: (
          <PaperFooterModal btnText="签约" button={renderButton(item)} />
        ),
      },
    ]
    return res.filter(i => !i.hide)
  }

  if (authLoading && isLoading) return <Loading />
  if (error) return <Error text="数据异常" />

  return (
    <div
      className="bg-[#F2F2F2] box-border h-screen w-full overflow-auto pb-16"
      ref={scrollContainer}
    >
      <div className="fixed top-0 bg-[#F2F2F2] w-full z-10">
        <div className="p-2">
          <SearchBar
            placeholder="输入代理商名称/代理商id"
            style={{ '--background': '#ffffff' }}
            onSearch={(value) => {
              scrollTop()
              setKeyWord(value)
              // setCurrentPage(1)
            }}
            onClear={() => {
              setKeyWord(null)
              // setCurrentPage(1)
            }}
          />
        </div>
        {isNumber(data?.pages?.[0]?.total) && (
          <div className="text-[#848484] px-2">
            共<span className="text-primary">{data?.pages?.[0]?.total}</span>个客户
          </div>
        )}
      </div>

      <PullToRefresh
        onRefresh={async () => {
          // 处理上拉刷新需要返回第一页的数据
          queryClient.resetQueries({ queryKey: ['currentPage', keyWord] })
        }}
      >
        <div className="p-2 pt-20">
          {data?.pages?.[0]?.list?.length === 0 && !keyWord
            ? (
              <Empty tip="暂无代理商">
                {authorityData?.[AGENT_LIST_AUTH['1.2.1.1']] &&
                !isPersonAgent && (
                  <Button
                    disabled={!authorityData?.[AGENT_LIST_AUTH['1.2.1.1']]}
                    color="primary"
                    block
                    className="btn-item w-[240px] h-[48px] m-auto"
                    onClick={() => {
                      if (hasCreateGray) {
                        navigator.navigate({ pathname: '/agent/check' })
                      } else {
                        Toast.show('您创建的是二级代理，该功能暂未开放。有需要请联系产品经理。')
                      }
                    }}
                  >
                    添加代理商
                  </Button>
                )}
              </Empty>
            )
            : (
              <>
                {data?.pages.map((group) => {
                  return group.list.map(item => (
                    <Card key={item.agentId} className="mb-2">
                      <div className="text-[#1E1E1E] text-base flex justify-between">
                        <div onClick={() => handleDetail(item.agentId)} className="font-medium">
                          {item.name}
                          <IconSVG
                            symbol="icon-xianxing_you"
                            className="inline align-sub"
                          />
                        </div>
                        {item.agentStr && (
                          <div
                            className={`${
                              item.agentCode === 3
                                ? 'text-[#F10505] bg-[#FFEAE6]'
                                : 'text-[#F56A07] bg-[#FFF4E6]'
                            } text-xs rounded leading-[18px] h-[16px] px-[4px]`}
                          >
                            {item.agentStr}
                          </div>
                        )}
                      </div>
                      <div className="mt-1 mb-2">
                        {item.authTags?.map(value => (
                          <Tag
                            key={value}
                            className="h-[21px] leading-4 mr-1"
                            color="primary"
                            fill="outline"
                            style={{ '--border-radius': '6px' }}
                          >
                            {value}
                          </Tag>
                        ))}
                      </div>
                      <PaperContent
                        onClick={() => handleDetail(item.agentId)}
                        loading={false}
                        data={contentFields(item)}
                      />
                      <PaperFooter button={footBtnFields(item)} />
                    </Card>
                  ))
                })}
                <InfiniteScroll
                  loadMore={() => fetchNextPage() as Promise<any>}
                  hasMore={!!hasNextPage && !isFetchingNextPage}
                >
                  <InfiniteScrollContent />
                </InfiniteScroll>
              </>
            )}
        </div>
      </PullToRefresh>

      {!data?.pages?.[0]?.noAgent &&
          authorityData?.[AGENT_LIST_AUTH['1.2.1.1']] &&
          !isPersonAgent && (
            <div className="fixed bottom-0 w-full p-2 bg-white">
              <Button
                color="primary"
                onClick={() => {
                  if (hasCreateGray) {
                    navigator.navigate({ pathname: '/agent/check' })
                  } else {
                    Toast.show('您创建的是二级代理，该功能暂未开放。有需要请联系产品经理。')
                  }
                }}
                block
                className="btn-item h-[48px]"
              >
                添加代理商
              </Button>
            </div>
      )}

      <CustomerServiceBubble />
    </div>
  )
}
