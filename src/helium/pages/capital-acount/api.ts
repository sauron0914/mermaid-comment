import { zApi } from '@/common/utils/api'

// 渠道分成资金账户（代理商、合资公司）
export const getBalance = (params) => {
  return zApi.get('/yangtze/api/v1/withdraw/account/channel-balance-info', { params })
}

// 渠道设备资金账户（代理商、合资公司）
export const deviceAccountBalance = (params) => {
  return zApi.get('/yangtze/api/v1/withdraw/account/channel-device-account-balance', { params })
}

// 设备资金账户流水（代理商、合资公司）
export const listDeviceBalance = (params) => {
  return zApi.get('/yangtze/api/v1/withdraw/account/channel-device-balance-list', { params })
}

// 渠道分成资金账号收支明细（代理商、合资公司）
export const balanceFlowList = (params) => {
  return zApi.get('/yangtze/api/v1/withdraw/account/channel-balance-flow-list', { params })
}

// 渠道提现记录（代理商、合资公司）
export const listWithdrawApply = (params) => {
  return zApi.get('/yangtze/api/v1/withdraw/account/channel-withdraw-apply-list', { params })
}
