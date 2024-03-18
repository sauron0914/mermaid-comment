import { useState } from 'react'
import { Button } from 'antd-mobile'
import { useRouter } from '@/common/hooks/use-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchListByPage, fetchAllTypes } from './api'

const WujieTest = () => {
  const { navigator, params, searchParams } = useRouter()
  const { id } = params
  const from = searchParams.get('from')
  const [typeList, setTypeList] = useState([])
  const [businessList, setBusinessList] = useState([])

  useQuery({
    queryKey: ['allTypes'],
    queryFn: fetchAllTypes,
    onSuccess (data) {
      setTypeList(data || [])
    },
  })

  // 获取商机列表
  const { mutate: fetchListByPageMutate } = useMutation({
    mutationFn (values:{currentPage: number, offset: number, pageSize: number, status: number}) {
      return fetchListByPage(values)
    },
    onSuccess (data) {
      setBusinessList(data)
    },
  })

  return (
    <div className="mt-10 m-5">
      我是list，获取路由参数id={id}from={from}
      <div className="mt-6 mb-6">
        获取品类列表成功！！！！！<br />
        {typeList?.map((el) => {
          return <p key={el.id}>{el.name}</p>
        })}
      </div>
      <Button
        color="primary" block size="large"
        className="mb-6"
        onClick={() => fetchListByPageMutate({
          currentPage: 1,
          offset: 1,
          pageSize: 10,
          status: 2,
        })}
      >
        获取商机列表1
      </Button>
      <div className="mb-10">
        {businessList?.list?.map((el) => {
          return <p key={el.businessId}>{el.businessName}</p>
        })}
      </div>

      <Button
        color="primary" block size="large"
        className="mb-3"
        onClick={() => {
          navigator.navigate(-1)
        }}
      >
        返回
      </Button>

    </div>
  )
}

export default WujieTest
