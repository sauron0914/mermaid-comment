import { omitBy, isUndefined } from 'lodash'
import { zApi } from '../utils/api'
import { useToastQuery } from './react-query'

type AddressItem = {
  name: string
  code: number
  children: AddressItem[]
}

const transformTree = (
  tree: AddressItem[],
) => {
  if (tree && Array.isArray(tree)) {
    return tree.map(({
      code,
      name,
      children,
    }) => omitBy({
      label: name,
      value: code,
      children: transformTree(children),
    }, isUndefined))
  }
}

export const useAddress = (...args) => {
  const { data } = useToastQuery({
    queryKey: ['AddressItem'],
    queryFn: () => zApi.get<AddressItem[]>('/virgo/getAllNew'),
    select (data) {
      return transformTree(data)
    },
    ...args,
  })

  return data
}
