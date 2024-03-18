import { Component } from 'react'
import { format } from '@/common/utils/time'

export default class Item extends Component {
  render () {
    const { onClick, data } = this.props
    let { bankNo, applyTime, applyAmount = 0, clientStatusStr, clientStatus, bankName, bankType } = data
    applyAmount = (applyAmount / 100).toFixed(2) || 0
    const bankNoStr = bankNo ? `(尾号${bankNo?.slice(-4)})` : ''

    return (
      <div className="px-3 bg-white" onClick={onClick && onClick}>
        <div className="py-3 border-0 border-b-[1px] border-solid border-b-[#E8E8E8]">
          <div className="inline-block w-[70%]">
            <div className="pb-1 flex items-center flex-wrap">
              <p className="truncate inline-block max-w-[120px] align-top text-base">{bankName}</p>
              <span className="text-tw-1e  text-base">{bankNoStr}</span> <span className="inline-block font-semibold h-4 leading-4 py-[1px] px-1 text-[10px] text-tw-84 bg-[#f5f5f5] align-baseline ml-2 rounded-[3px]">{
              bankType === 2 ? '个人卡' : '企业卡'
            }</span></div>
            <p className="text-sm text-tw-84">
              {format(applyTime, 'YYYY.MM.DD HH:mm:ss')}
            </p>
          </div>
          <div className="inline-block w-[30%] text-right">
            <div>
              <p
                className="text-base pb-1"
              >
                {applyAmount}
              </p>
              <span
                style={{
                  color:
                  clientStatus === 5
                    ? '#0FB269'
                    : clientStatus === 1 || clientStatus === 4
                      ? '#F56A07'
                      : '#848484',
                  backgroundColor: clientStatus === 5
                    ? '#E6FFEE'
                    : clientStatus === 1 || clientStatus === 4
                      ? '#FFF4E6'
                      : '#F5F5F5',
                }}
                className="inline-block h-4 leading-4 py-[1px] px-1 text-[12px] align-baseline rounded-[3px]"
              >
                {clientStatusStr}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
