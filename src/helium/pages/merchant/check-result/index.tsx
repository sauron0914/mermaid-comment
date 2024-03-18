import { useMemo } from 'react'
import { Card, Toast, Button, Divider } from 'antd-mobile'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useToastQuery, useToastMutation } from '@/common/hooks/react-query'
import { fetchMerchantBasicInfoByMobile, directClaim } from './api'
import { PaperContent } from '@/common/components/paper'
import { IconSVG } from '@/common/components/icon-svg'
import { useRouter } from '@/common/hooks/use-router'
import { Loading } from '@/common/components/loading'
import Error from '@/common/components/error'
import { unableClaimReason, unableClaimGuide, MERCHANT_TIP_BG, MERCHANT_TIP_TEXT } from './constant'
import { target } from '@/common/utils/env'

export default function MerchantCheck () {
  const { navigator, searchParams } = useRouter()

  const { data: merchantInfo = {}, isLoading, error } = useToastQuery({
    queryKey: ['fetchMerchantBasicInfoByMobile'],
    queryFn: () =>
      fetchMerchantBasicInfoByMobile({
        mobile: searchParams.get('mobile') || '',
      }),

  })

  const { mutate: fetchMerchantDirectClaim } = useToastMutation({
    mutationFn (values: {
      id: number
    }) {
      return directClaim(values)
    },
    onSuccess () {
      Toast.show('认领成功')
      // 跳转到列表页
      navigator.navigate({
        pathname: '/merchant/list',
      })
    },
    onError () {
      Toast.show('认领失败')
    },
  })

  const contentFields = (merchantInfo) => {
    const baseData = [
      {
        label: '商户手机号',
        value: <span className="text-[#0FB269] underline">{searchParams.get('mobile')} </span>,
      },
      {
        label: '商户ID',
        value: <CopyToClipboard
          text={merchantInfo.merchantId}
          onCopy={() => {
            Toast.show('复制成功')
          }}
        >
          <span
            className="text-[#0FB269] underline" onClick={(e) => {
              e.stopPropagation()
            }}
          >{merchantInfo.merchantId} <IconSVG symbol="icon-xianxing_fuzhi" className="w-[16px] ml-1" style={{ marginLeft: '2px', color: '#0FB269' }} /></span>
        </CopyToClipboard>,
      },
      { label: '商户名称', value: merchantInfo.name },
      // { label: '联系人姓名', value: merchantInfo.contactName },
      // { label: '联系地址', value: merchantInfo.address },
      {
        label: '认证状态',
        value: merchantInfo.authStatus ? '已认证' : '未认证',
      },
      {
        label: '商户负责人',
        value:
            (merchantInfo.managerName || '') +
            (merchantInfo.managerStatus ? ' (已离职)' : ''),
      },
    ]

    return baseData
  }

  const handleDetail = () => {
    // console.log('跳转详情')
  }

  const renderCheckResult = useMemo(() => {
    const { managerApplyCheck } = merchantInfo
    const { failReason, resultType, operateType } =
    managerApplyCheck || {}

    const operate = operateType && (
      <div className="p-2">
        <div>您可以：{unableClaimGuide[operateType]}</div>
      </div>
    )

    // 不能认领
    if (resultType === 0) {
      return (
        (failReason || operateType) && (
          <div>
            <div
              className={`px-2 py-3 
                ${MERCHANT_TIP_TEXT[failReason] || 'text-[#F56A07]'} 
                ${MERCHANT_TIP_BG[failReason] || 'bg-[#FFF4E6]'}`}
            >
              {unableClaimReason[failReason]}
            </div>
            {operate}
          </div>
        )
      )
    }

    // 1直接认领，2申请认领
    if ([1, 2].includes(resultType)) {
      return (
        <>
          {(failReason || operateType) && (
            <div>
              <div
                className={`px-2 py-3 
                ${MERCHANT_TIP_TEXT[failReason] || 'text-[#F56A07]'} 
                ${MERCHANT_TIP_BG[failReason] || 'bg-[#FFF4E6]'}`}
              >
                {unableClaimReason[failReason]}
              </div>
              {operate}
            </div>
          )}
        </>
      )
    }

    // 认领中
    if (resultType === 3) {
      return (
        <div>
          {(failReason || operateType) && (
            <div>
              <div
                className={`px-2 py-3 
                ${MERCHANT_TIP_TEXT[failReason] || 'text-[#F56A07]'} 
                ${MERCHANT_TIP_BG[failReason] || 'bg-[#FFF4E6]'}`}
              >
                {unableClaimReason[failReason]}
              </div>
              {operate}
            </div>
          )}
        </div>
      )
    }
  }, [merchantInfo])

  const renderButton = useMemo(() => {
    const { managerApplyCheck, merchantId: id, isManager } = merchantInfo
    const { resultType, extData } =
    managerApplyCheck || {}
    const { accountClaimRecordId, processNo, newProcess } = extData || {}

    // 1直接认领，2申请认领
    if ([1, 2].includes(resultType)) {
      return (
        <div className="fixed bottom-0 w-full p-2 bg-white">
          <Button
            block
            className="btn-item h-[48px]"
            color="primary"
            onClick={() => {
              // 直接认领
              if (resultType === 1) {
                fetchMerchantDirectClaim({ id: id })
                // actions.applyCustomerManager({ id: customerRegisterInfo.id })
              } else {
                navigator.navigate({
                  pathname: '/merchant/claim',
                  query: {
                    merchantId: id,
                  },
                })
              }
            }}
          >
            {resultType === 1 ? '直接认领商户' : '申请认领商户'}
          </Button>
        </div>
      )
    }

    // 认领中
    if (resultType === 3 && isManager) {
      return (
        <div className="fixed bottom-0 w-full p-2 bg-white">
          <Button
            block
            className="btn-item h-[48px]"
            color="primary"
            onClick={() => {
              if (newProcess) {
                navigator.href('indra', {
                  pathname: '/task-new-detail',
                  query: {
                    businessId: accountClaimRecordId,
                    processInstanceId: processNo,
                  },
                })
              } else {
                navigator.href(target, {
                  pathname: '/approvalCenter/taskDetail',
                  query: {
                    businessId: accountClaimRecordId,
                    processInstanceId: processNo,
                  },
                })
              }
            }}
          >
            查看审批进度
          </Button>
        </div>
      )
    }
  }, [fetchMerchantDirectClaim, merchantInfo, navigator])

  if (isLoading) return <Loading />
  if (error) return <Error text="数据异常" />

  // console.log('merchantInfo', merchantInfo)
  return (
    <section className="h-screen w-full overflow-auto bg-[#F2F2F2]">

      {merchantInfo.merchantId && (
        <section className="form-wrap">
          {renderCheckResult}
          <Card
            className="mx-2 mt-2"
          >
            <div className="text-[#1E1E1E] text-base flex justify-between items-center">
              <div
                onClick={handleDetail}
                className="font-medium"
              >
                商户信息
              </div>
            </div>
            <Divider className="my-3" />
            <PaperContent
              onClick={handleDetail}
              loading={false}
              data={contentFields(merchantInfo)}
              align="between"
            />
          </Card>

        </section>
      )}
      {renderButton}
    </section>
  )
}
