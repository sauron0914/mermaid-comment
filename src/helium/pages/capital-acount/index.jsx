import { IconSVG } from '@/common/components/icon-svg'
import { useRouter } from '@/common/hooks/use-router'
import { useToastQuery } from '@/common/hooks/react-query'
import './index.less'
import { toMoney } from '@/common/utils/format'
import {
  getBalance,
  deviceAccountBalance,
} from './api'
const CapitalAcount = () => {
  const { searchParams } = useRouter()
  const queryChannelId = searchParams.get('queryChannelId')
  const hierarchy = searchParams.get('hierarchy')

  const { data: accountBalanceData } = useToastQuery({
    queryKey: ['getBalance'],
    queryFn: () =>
      getBalance({
        queryChannelId,
      }),
  })
  const { data: deviceData } = useToastQuery({
    queryKey: ['deviceAccountBalance'],
    queryFn: () =>
      deviceAccountBalance({
        queryChannelId,
      }),
  })
  const { navigator } = useRouter()
  return (
    <div className="capital-acount-wrap">
      <div className="item item-withdraw">
        <p className="name">{accountBalanceData?.channelName}余额账户（元）</p>
        <h2>{toMoney(accountBalanceData?.balanceAccount / 100 || 0)}</h2>
        <div className="btn-wrap">
          <div className="detail-btn">
            <p onClick={() => {
              navigator.navigate({
                pathname: '/paymen-record/list',
                query: {
                  queryChannelId,
                },
              })
            }}
            >
              账户收支明细   <IconSVG symbol="icon-xianxing_you" className="w-3 h-3" />
            </p>
            <p onClick={() => {
              navigator.navigate({
                pathname: '/cash-record/list',
                query: {
                  queryChannelId,
                },
              })
            }}
            >
              提现记录 <IconSVG symbol="icon-xianxing_you" className="w-3 h-3" />
            </p>
          </div>
        </div>
      </div>
      {
      Number(hierarchy) !== 2 && <div className="item item-charge">
        <p className="name">设备资金账户（元）</p>
        <h2>{toMoney(deviceData?.residualAmount / 100 || 0)}</h2>
        {/* <span className="tips">
        已累计充值代理费¥{accountBalanceData?.allAgentAmount || 0}；
        {accountBalanceData?.agentLevelStr || '-'}，
        获{accountBalanceData?.agentDivide || 0}%分成</span> */}
        <div className="btn-wrap">
          <div
            className="detail-btn" onClick={() => {
              navigator.navigate({
                pathname: '/capital-acount/list',
                query: {
                  queryChannelId,
                },
              })
            }}
          >
            <p>
              收支明细
              <IconSVG symbol="icon-xianxing_you" className="w-3 h-3" />
            </p>
          </div>
        </div>
      </div>
      }

    </div>
  )
}

export default CapitalAcount
