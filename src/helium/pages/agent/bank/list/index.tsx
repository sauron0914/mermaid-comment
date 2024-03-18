import { Card, Divider, Button } from 'antd-mobile'
import { PaperContent } from '@/common/components/paper'
import { useToastQuery } from '@/common/hooks/react-query'
import { useRouter } from '@/common/hooks/use-router'

import { Loading } from '@/common/components/loading'
import Error from '@/common/components/error'
import { fetchAgentBankList, fetchPageOperatorAuthority, fetchAgentDetail } from './api'
import Empty from '@/common/components/empty'
import { AGENT_BANK_LIST_AUTH } from '@/common/constants/index'

export default function AgentBankList () {
  const { navigator, searchParams } = useRouter()

  // 获取权限
  const { data: authorityData } = useToastQuery({
    queryKey: ['fetchAgentAuthority'],
    queryFn: () =>
      fetchPageOperatorAuthority({
        resCodeList: Object.keys(AGENT_BANK_LIST_AUTH),
      }),
  })

  const {
    data: bankList = [],
    isLoading,
    error,
  } = useToastQuery({
    queryKey: ['fetchAgentBankList'],
    queryFn: () =>
      fetchAgentBankList({
        agentId: searchParams.get('agentId'),
      }),
  })

  const { data: agentDetail } = useToastQuery({
    queryKey: ['bank/list/agentDetail'],
    queryFn: () =>
      fetchAgentDetail({
        id: searchParams.get('agentId'),
      }),
  })

  function bankContentField (bankInfo) {
    return [
      {
        label: '银行卡类型',
        value: bankInfo.cardType === 1 ? '企业银行卡' : '个人银行卡',
      },
      {
        label: '持卡人姓名',
        value: bankInfo.accountName,
      },
      {
        label: '身份证号码',
        value: bankInfo.idCardNo,
        hide: bankInfo.cardType === 1,
      },
      { label: '银行卡号', value: bankInfo.bankCardNo },
      { label: '开户银行', value: bankInfo.bankName },
      { label: '开户行省市', value: `${bankInfo.province} ${bankInfo.city}` },
      { label: '开户支行', value: bankInfo.bankBranchName },
    ]
  }

  if (isLoading && bankList) return <Loading />

  if (isLoading) return <Loading />
  if (error) return <Error text="数据异常" />

  return (
    <section className="h-screen w-full overflow-auto bg-[#F2F2F2] pt-2 pb-16">
      {bankList.length > 0
        ? (
          bankList &&
          bankList.map((item, index) => (
            <Card key={item.bankCardNo} className="mx-[8px] mb-[8px]">
              <div className="text-[20px] text-black">银行卡{index + 1}</div>
              <Divider className="my-3" />
              <PaperContent loading={false} data={bankContentField(item)} />
            </Card>
          ))
        )
        : (
          <Empty text="暂无银行卡数据" />
        )}

      {(authorityData?.[AGENT_BANK_LIST_AUTH['1.1.3.1']] && agentDetail?.basicData?.manageBelongOwn) && (
        <div className="fixed bottom-0 w-full p-2 bg-white flex items-center">
          <Button
            color="primary"
            className="flex-1 h-10 ml-2"
            onClick={() => {
              navigator.navigate({
                pathname: '/agent/bank/create',
                query: {
                  agentId: `${searchParams.get('agentId')}`,
                },
              })
            }}
          >
            添加银行卡
          </Button>
        </div>
      )}
    </section>
  )
}
