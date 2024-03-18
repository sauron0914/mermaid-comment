import type { FC } from 'react'
import { useState, useMemo, useRef, useContext } from 'react'
import { Card, Toast, Button, Tag, Divider, Popup, ActionSheet, Modal } from 'antd-mobile'
import { IconSVG } from '@dian/common/components/icon-svg'
import { CopyToClipboard } from 'react-copy-to-clipboard'
// eslint-disable-next-line import/no-unresolved
import { useRouter } from '@dian/app-utils/router'
import { isHonor, target } from '@/common/utils/env'
import type {
  Action,
  ActionSheetShowHandler,
} from 'antd-mobile/es/components/action-sheet'
import { getUserAgentId } from '@/common/utils/cookie'
import { computeWarningsText } from './tips-dodal'
import { MerchantListContext } from '../context'

const profitContractType = {
  0: { label: '开通', xdlogId: 'kionubuw8kc3yf' },
  1: { label: '变更', xdlogId: 'kionuy8ivetwhf' },
  2: { label: '关闭', xdlogId: 'kionv3zuhby7u4' },
}
const userAgentId = getUserAgentId()

interface IProps {
  merchantInfo: Record<string, any>;
  refetchData: () => void;
  setPageMask?: () => void;
}

const MerchantItem:FC<IProps> = ({ merchantInfo }) => {
  const {
    merchantId, signProfitCheck, profitContractProcess, profitContractId, contactMobile,
    name, boId, sourceFrom, accountId,
  } = merchantInfo || {}
  const { type, processInstanceId, bizId } = profitContractProcess || {}
  const { pass, failReason, operateType, extData } = signProfitCheck || {}
  const { navigator } = useRouter()
  const [popupVisible, setPopupVisible] = useState(false)
  const isNewContract = profitContractId > 10000000
  const handler = useRef<ActionSheetShowHandler>()
  const { merchantListPermissions = {} } = useContext(MerchantListContext)

  const renderTagList = (item) => {
    const { authStatus, authTags } = item

    if (!authStatus) {
      return (
        <Tag color="#F8F8F8" style={{ '--text-color': '#585858' }}>
          未认证
        </Tag>
      )
    }
    if (authStatus && authTags?.length) {
      return (
        <>
          {
          authTags.map(it => (
            <Tag color="#0FB269" key={it.id}>{it.typeStr}</Tag>
          ))
          }
        </>
      )
    }
  }

  const renderBtn = (operateType): any => {
    const isSHOPREL = operateType === 'SHOP_REL'
    const btnLis: any = [
      {
        key: 'cancel',
        text: isSHOPREL ? '取消' : '我知道了',
      },
    ]

    if (isSHOPREL) {
      btnLis.push({
        key: 'related',
        text: '关联商机',
        onClick () {
          navigator.href(target, `/business/list?hideNotice=true&hideTabsBar=true&showNewBusinessBtn=true&businessListQuery=${JSON.stringify(
            { status: 2 },
          )}`)
        },
      })
    }
    return btnLis
  }

  const handelRenderModal = ({
    failReason,
    operateType,
    extData,
  }) => {
    const warningStr = computeWarningsText({
      failReason,
      operateType,
      extData,
    })
    Modal.show({
      title: '温馨提示',
      content: warningStr,
      closeOnAction: true,
      actions: renderBtn(operateType),
    })
  }

  const buttonList = useMemo(() => {
    return [
      {
        title: <span>开通合同</span>,
        icon: 'icon-beijiankushebei',
        visible: merchantListPermissions['1.2.5.3'] && !profitContractProcess && !profitContractId && !pass,
        onClick () {
          // 提示信息
          handelRenderModal({
            failReason,
            operateType,
            extData,
          })
        },
      },
      {
        title: <span>开通合同</span>,
        icon: 'icon-beijiankushebei',
        visible: merchantListPermissions['1.2.5.3'] && !profitContractId && pass,
        onClick () {
          if (userAgentId > 3) {
            const actions = [
              {
                text: <span>开通合同<span style={{ color: '#0fb269' }}>(签约法律合同)</span></span>,
                key: 'openDivide',
                onClick () {
                  if (isHonor) {
                    navigator.href(target, `/merchant/sign-contract/merchant-info?mobile=${contactMobile}&from=6&legal=1&origin=shopDetail`)
                  } else {
                    navigator.href(target, `/merchant/sign-contract/merchant-info?mobile=${contactMobile}&from=6&legal=1&contractBizGroup=${2}&merchantId=${merchantId}&origin=shopDetail`)
                  }
                },
              },
              {
                text: <span>开通合同<span style={{ color: '#0fb269' }}>(不签约法律合同)</span></span>,
                key: 'openDivideNo',
                onClick () {
                  if (isHonor) {
                    navigator.href(target, `/merchant/sign-contract/submit-apply?boId=${boId}&bizId=${bizId}&mobile=${contactMobile}&merchantId=${merchantId}&from=6&sourceFrom=${sourceFrom}&name=${name}&referId=${merchantId}&contractLegalType=0&standard=1`)
                  } else {
                    navigator.href(target, `/merchant/sign-contract/submit-apply?boId=${boId}&bizId=${bizId}&mobile=${contactMobile}&merchantId=${merchantId}&from=6&sourceFrom=${sourceFrom}&name=${name}&contractLegalType=0&standard=1`)
                    // shopId
                  }
                },
              },
              {
                text: <span>开通资金类合同<span style={{ color: '#0fb269' }}>(签约法律合同)</span></span>,
                key: 'openDivideNo',
                onClick () {
                  navigator.href(target, `/merchant/sign-contract/merchant-info?mobile=${contactMobile}&from=6&legal=1&contractBizGroup=${1}&merchantId=${merchantId}&origin=shopDetail`)
                },
                hide: isHonor,
              },
              {
                text: '取消',
                key: 'edit',
                onClick () {
                  handler.current?.close()
                },
              },
            ].filter(item => !item.hide)

            handler.current = ActionSheet.show({
              actions,
            })
          } else {
            navigator.href(target, `/merchant/sign-contract/merchant-info?mobile=${contactMobile}&from=6&legal=1&origin=shopDetail`)
          }
        },
      },
      {
        title: <span>重新分配</span>,
        icon: 'icon-beijiankushebei',
        visible: merchantListPermissions['1.2.5.8'],
        onClick () {
          navigator.navigate(`/merchant/assign-BD?accountId=${accountId}`)
        },
      },
      {
        title: <span>查看{profitContractType?.[type]?.label || ''}分成进度</span>,
        icon: 'icon-beijiankushebei',
        visible: merchantListPermissions['1.2.5.6'] && profitContractProcess,
        onClick () {
          if (profitContractProcess?.isNew) {
            // 新审批中心
            navigator.href('indra', {
              pathname: '/task-new-detail',
              query: {
                businessId: bizId,
                processInstanceId: processInstanceId,
              },
            })
          } else {
            // 旧审批中心区分新老合同
            navigator.href(target, {
              pathname: `/${isNewContract ? 'approval-center/task-detail' : 'approvalCenter/taskDetail'}`,
              query: {
                processInstanceId,
                businessId: bizId,
              },
            })
          }
        },
      },
      {
        title: <span>变更分成</span>,
        icon: 'icon-beijiankushebei',
        visible: merchantListPermissions['1.2.5.4'] && !profitContractProcess && profitContractId,
        onClick () {
          if (isNewContract) {
            const actions: Action[] = [
              {
                text: '门店变更',
                key: 'shopChange',
                onClick () {
                  navigator.href(target, `/contract/alteration/${profitContractId}/shop?from=6`)
                },
              },
              {
                text: '分成变更',
                key: 'divideChange',
                onClick () {
                  navigator.href(target, `/contract/alteration/${profitContractId}?from=6`)
                },
              },
              {
                text: '取消',
                key: 'edit',
                onClick () {
                  handler.current?.close()
                },
              },
            ]
            handler.current = ActionSheet.show({
              actions,
            })
          } else {
            navigator.href(target, `/merchant/shareSubmit?isNew=2&merchantId=${merchantId}&phone=${contactMobile}&from=6`)
          }
        },
      },
      {
        title: <span>分成关闭</span>,
        icon: 'icon-beijiankushebei',
        visible: merchantListPermissions['1.2.5.5'] && !profitContractProcess && profitContractId,
        onClick () {
        // 关闭分成
          let closeUrl = `merchant/close?&merchantId=${merchantId}&phone=${contactMobile}&from=6`
          if (isNewContract) {
            closeUrl = `contract/termination/${profitContractId}?from=6`
          }
          navigator.href(target, `/${closeUrl}`)
        },
      },

      {
        title: <span>商家运营</span>,
        icon: 'icon-beijiankushebei',
        visible: merchantListPermissions['1.2.5.7'],
        onClick () {
          navigator.href(target, `/shop/coupon?shopName=${name}&phone=${contactMobile}`)
        },
      },
    ].filter(item => item.visible)
  }, [merchantInfo, merchantListPermissions])

  const renderOwnerUser = useMemo(() => {
    const list = [
      {
        label: '负责人',
        value: merchantInfo.managerName,
        hide: merchantInfo.managerName === '',
      },
      {
        label: '门店数',
        value: merchantInfo.shopNum,
      },
    ].filter(item => !item.hide)

    return list.map((item, index) => {
      return (
        <span key={index}>
          {index !== 0 && <Divider direction="vertical" className="mx-2" style={{ borderColor: '#EFEFEF' }} />}
          <span className="text-[#848484]" key={index}>{item.label}：<span>{item.value}</span></span>
        </span>
      )
    })
  }, [merchantInfo])

  return (
    <Card
      className="mb-2"
    >
      <div
        onClick={() => {
          navigator.navigate({
            pathname: '/merchant/detail',
            query: {
              accountId: merchantInfo.accountId,
            },
          })
        }}
      >
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="text-[16px] font-bold mr-1">{merchantInfo?.name}</div>
            <IconSVG symbol="icon-xianxing_you" className="inline w-4 h-4" color="#848484" />
          </div>
          {/* {
             !merchantInfo.authStatus && isHonor && <span
               className="text-[#848484]" onClick={(e) => {
                 e.stopPropagation()
                 navigator.href(target, `/crm/customer/auth-guide?customerId=${id}&name=${name}`)
               }}
             >
               待认证
               <IconSVG symbol="icon-xianxing_you" style={{ fontSize: '12px' }} />
             </span>
          } */}
        </div>
        <div className="space-x-1 my-1">
          {renderTagList(merchantInfo)}

          <Tag color="#f8f8f8" style={{ '--text-color': '#585858' }}>
            <div className="flex items-center">
              <span>{merchantInfo.merchantId}</span>
              <span onClick={e => e.stopPropagation()}>
                <CopyToClipboard
                  text={merchantInfo.merchantId}
                  onCopy={() => { Toast.show('复制成功') }}
                >
                  <IconSVG symbol="icon-xianxing_fuzhi" className="w-3 h-3 text-[#0FB269] mx-[2px]" />
                </CopyToClipboard>
              </span>
            </div>
          </Tag>
        </div>

        {/* 商户各个负责人信息 */}
        <div>{renderOwnerUser}</div>
        {
          buttonList.length > 0 && <Divider className="my-3" style={{ borderColor: '#EFEFEF' }} />
        }
      </div>

      <div className="text-right space-x-1">
        {
          buttonList.length > 2
            ? <Button size="small" className="px-2 text-gray-800" onClick={() => { setPopupVisible(true) }}>
              更多操作<IconSVG symbol="icon-jiantou0101" className="inline w-4 h-4" color="#848484" />
            </Button>
            : null
        }

        {
          (buttonList.slice(0, 2).reverse()
            .map((item, index) => (
              <Button key={index} size="small" className="px-2" fill={item.fill ? item.fill : 'solid'} color="primary" onClick={item.onClick}>
                {item.title}
              </Button>
            )))
        }
      </div>

      <Popup
        visible={popupVisible}
        onClose={() => { setPopupVisible(false) }}
        onMaskClick={() => { setPopupVisible(false) }}
      >
        <div className="pt-4 pb-6">
          {
            buttonList.slice(2).map((item, index) => (
              <div key={index}>
                {index !== 0 && <Divider className="my-4" style={{ borderColor: '#EFEFEF' }} />}
                <div
                  className="text-[16px] text-center"
                  onClick={() => {
                    setPopupVisible(false)
                    item.onClick()
                  }}
                >{item.title}</div>
              </div>
            ))
          }
        </div>
      </Popup>
    </Card>
  )
}

export default MerchantItem
