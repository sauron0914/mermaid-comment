import Empty from '@/common/components/empty'
import { IconSVG } from '@/common/components/icon-svg'
import { Card, SearchBar, CheckList, Button, Toast, Modal } from 'antd-mobile'
import './index.css'
import { useMutation } from '@tanstack/react-query'
import { allocatableBDApi, fetchAllocatableBDApi } from './api'
import { useState } from 'react'
// eslint-disable-next-line
import { useRouter } from '@dian/app-utils/router'
import { useToastMutation } from '@/common/hooks/react-query'

const AssignBD = () => {
  const [allocatableBD, setAllocatableBD] = useState<any>(null)
  const [allocatableInfo, setAllocatableInfo] = useState<any>({
    assignContractFlag: true,
  })
  const { searchParams, navigator } = useRouter()
  // 获取可分配的BD
  const { mutate: fetchAllocatableBD } = useMutation({
    mutationFn: fetchAllocatableBDApi,
    onSuccess (data) {
      setAllocatableBD(data)
    },
  })

  // 分配
  const { mutate: allocate } = useToastMutation({
    mutationFn: allocatableBDApi,
    onSuccess (data) {
      if (typeof data === 'object') {
        Modal.alert({
          title: '提示',
          content: '该商户已在申请认领审批流程中，暂时无法分配，待审批流程完结后再操作',
        })
      }
      Toast.show({
        content: data,
        afterClose () {
          navigator.navigate(-1)
        },
      })
    },
  })

  const allocatableBDHandle = () => {
    if (!searchParams.get('accountId')) {
      return Toast.show('无商户，不允许分配')
    }
    if (!allocatableInfo.id) {
      return Toast.show('未选中BD，不允许分配')
    }
    allocate({
      accountId: searchParams.get('accountId')!,
      targetUserId: allocatableInfo.id,
      assignContractFlag: !!allocatableInfo.assignContractFlag,
    })
  }

  return (
    <div className="h-screen w-full overflow-auto bg-[#F2F2F2] pt-10">
      <div className="p-2 fixed top-0 w-full z-10 bg-[#F2F2F2]">
        <SearchBar
          placeholder="请输入接受人的花名"
          style={{ '--background': '#ffffff' }}
          onSearch={(nickName) => {
            if (!nickName) return
            fetchAllocatableBD({ nickName })
          }}
          onClear={() => {
            // console.log('clear')
          }}
        />
      </div>
      {
        allocatableBD !== null && allocatableBD.length === 0 && <Empty text="暂无信息，请重新搜索" />
      }
      {
        allocatableBD?.length > 0 &&
          <div className="p-2">
            <Card
              title="选择分配人员"
              headerStyle={{ border: 'none', paddingBottom: '0' }}
              bodyStyle={{ border: 'none', paddingBottom: '0' }}
              className="mb-2"
            >
              <CheckList
                className="assign-BD-checklist-border-none"
                extra={active =>
                  (active ? <IconSVG symbol="icon-check-mark" /> : <IconSVG className="text-[#B0B0B0]" symbol="icon-xianxing_kexuan" />)}
                onChange={(id) => {
                  setAllocatableInfo({
                    ...allocatableInfo,
                    id: id[0],
                  })
                }}
              >
                {
              allocatableBD.map(item => (
                <CheckList.Item key={item.id} className="text-sm pl-0" value={item.id}>{item.nickName}</CheckList.Item>
              ))
            }
              </CheckList>
            </Card>
            <Card
              title="选择分配操作类型"
              className="mb-20"
              headerStyle={{ border: 'none', paddingBottom: '0' }}
              bodyStyle={{ border: 'none', padding: '0' }}
            >
              <CheckList
                className="assign-BD-checklist-border-none"
                defaultValue={['true']}
                extra={active =>
                  (active ? <IconSVG symbol="icon-check-mark" /> : <IconSVG className="text-[#B0B0B0]" symbol="icon-xianxing_kexuan" />)}
                onChange={(e) => {
                  setAllocatableInfo({
                    ...allocatableInfo,
                    assignContractFlag: !!e[0],
                  })
                }}
              >
                <CheckList.Item className="text-sm pl-0" value="true">分配商户的同时分配纯分成合同，可以进行分成关闭变更操作</CheckList.Item>
              </CheckList>
            </Card>
            <div className="p-2 flex fixed bottom-0 w-full bg-white">
              <Button className="flex-1 mx-2" onClick={() => navigator.navigate(-1)}>取消</Button>
              <Button onClick={allocatableBDHandle} className="flex-1 mx-2" color="primary">确认</Button>
            </div>
          </div>
      }

    </div>
  )
}

export default AssignBD
