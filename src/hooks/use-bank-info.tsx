import type { LabelValueOption } from '../types'
import { zApi } from '../utils/api'
import { useToastQuery } from './react-query'

type BankInfo = {
  bankName: string
  bankNo: number
  bankCode: string
  bankLogo: string
}

type SubBankInfo = Omit<BankInfo, 'bankLogo' | 'bankCode'> & {
  branchName: string
  branchNo: number
  cityName: string
  cityCode: number
  parentCode: number
}

export const useBankInfo = (...args): LabelValueOption<number>[] => {
  const { data } = useToastQuery({
    queryKey: ['query-bank'],
    queryFn: () => zApi.get<BankInfo[]>('/mdm/banks/info'),
    select: data => data.map(({
      bankName,
      bankNo,
    }) => ({
      label: bankName,
      value: bankNo,
    })),
    ...args,
  })
  return data || []
}

export const useSubBankInfo = ({
  queryKey,
  queryParams,
  ...args
}): LabelValueOption<number>[] => {
  const { data } = useToastQuery({
    queryKey: ['query-sub-bank', ...queryKey],
    queryFn: () => zApi.get<SubBankInfo[]>('/mdm/banks/branch/like', {
      params: queryParams,
    }),
    select: data => data.map(({
      branchName,
      branchNo,
    }) => ({
      label: branchName,
      value: branchNo,
    })),
    ...args,
  })
  return data || []
}
