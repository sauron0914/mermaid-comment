import { zApi } from '@dian/app-utils'

export interface AccountBalanceEntity {
  channelId: number
  id: number
  channelName: string
  agentName: string
  accountId: string
  balanceAccount: string
  freezeAmountCny: string
  allAmountCny: string
  managerNick: string
  managerMobile: string
  settleSubjectId: number
  settleSubjectType: number
  settleSubjectName: string
  oldAccountId: number
}

// 获取我的账户余额
export const fetchAccountBalance = () => {
  return zApi.get<AccountBalanceEntity>('/mch-fund/channel/account/balance')
}
