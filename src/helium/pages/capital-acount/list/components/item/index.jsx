import { toMoney } from '@/common/utils/format'
import { format } from '@/common/utils/time'
import './index.less'

const AgencyFeeItem = (props) => {
  const { data } = props
  return (
    <div
      className="agency-fee-item"
      style={{ borderBottom: '1px solid #eeeeee' }}
    >
      <p>
        <span>{data.balanceName || '-'}</span>
        <span className="money-text">{toMoney(data.balanceAmount / 100 || 0)}</span>
      </p>
      <p>
        <span>{format(data.balanceTime, 'YYYY-MM-DD HH:mm:ss')}</span>
        {data.success && <span>成功</span>}
      </p>
    </div>
  )
}

export default AgencyFeeItem
