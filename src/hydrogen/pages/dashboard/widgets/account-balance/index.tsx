import { forwardRef, useImperativeHandle } from 'react'
import { useQuery } from '@tanstack/react-query'
import { href } from '@dian/app-utils/href'
import { fetchAccountBalance } from './api'

import type { AccountBalanceEntity } from './api'
import type { WidgetRef } from '../../types'

export const AccountBalance = forwardRef<WidgetRef>(function AccountBalance (_, ref) {
  const {
    data: accontInfo,
    refetch,
  } = useQuery<AccountBalanceEntity, Error>({
    queryKey: ['fetchAccountBalance'],
    async queryFn () {
      return await fetchAccountBalance()
    },
  })

  const fetchData = async () => {
    await refetch()
  }

  useImperativeHandle(ref, () => ({ fetchData }))

  const handleCardClick = () => {
    href('mammon', '/capital-acount')
  }

  // if (error) {
  // return <Empty type={3} text={error?.message ?? '暂无数据'} />
  // }

  return (
    <div className="box-border h-[85px] p-3 my-3 rounded bg-[url('http://img3.dian.so/lhc/2021/12/29/294w_216h_A98881640777348.png')] bg-[#00AF50] bg-no-repeat bg-right bg-auto text-white" onClick={handleCardClick}>
      <div className="text-xs">
        {accontInfo ? accontInfo.settleSubjectName : '余额账户（元）'}
      </div>
      <div className="text-[28px] leading-[38px] mt-2">{
        (accontInfo ? parseFloat(accontInfo.balanceAccount) : 0).toFixed(2)
      }</div>
    </div>
  )
})
