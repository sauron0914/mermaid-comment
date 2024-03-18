import { useMemo, useState } from 'react'
import { useToastQuery, useToastMutation } from '@/common/hooks/react-query'
import { Card, Toast, Button, Dialog } from 'antd-mobile'
import classnames from 'classnames'
import { unbaleDelContractReason, unbaleDelContractGuide } from './constant'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { IconSVG } from '@/common/components/icon-svg'
import { PaperContent } from '@/common/components/paper'
import Empty from '@/common/components/empty'
import { useRouter } from '@/common/hooks/use-router'
import { MERCHANT_DETAIL_AUTH } from '@/common/constants/index'
import { getCurrentUser } from '@dian/app-utils'
import { getUserId } from '@/common/utils/cookie'

import { debounce } from 'lodash'
import {
  getAuthRecord,
  getMechantDetail,
  getAuthList,
  readnSensitiveData,
  deleteIdentifyInfo,
  fetchPageOperatorAuthority,
  registerCA,
} from './api'
import Error from '@/common/components/error'
import { Loading } from '@/common/components/loading'
import './index.css'
const numberMap = {
  1: '一',
  2: '二',
  3: '三',
}
export default function MerchantDetail () {
  const isHonor = window.localStorage.getItem('isHonor') === 'true' // 是否是honor
  const targetApplication = isHonor ? 'honor' : 'mammon'

  const [open, setOpen] = useState<any>(false)
  const { navigator, searchParams } = useRouter()
  const accountId = searchParams.get('accountId')
  // 获取认证列表
  const { mutate: getAuthRecordData, data: authRecordList } = useToastMutation({
    mutationFn: getAuthRecord,
  })
  // 读取脱敏信息
  const { mutate: readnSensitiveMutate } = useToastMutation({
    mutationFn: readnSensitiveData,
  })

  const {
    data: basicDetail = {},
    error,
    isLoading,
  } = useToastQuery({
    queryKey: ['basicDetail'],
    queryFn: () =>
      getMechantDetail({
        id: Number(accountId),
      }),
    onSuccess () {
      if (basicDetail?.merchantId) {
        getAuthRecordData({
          merchantId: basicDetail?.merchantId,
          mchType: 1,
        })
      }
    },
  })
  const isSameManager = basicDetail.managerId === getUserId()

  // 获取权限
  const { data: merchantDetailPermissions, isLoading: authLoading } = useToastQuery({
    queryKey: ['merchant_detail_permission'],
    queryFn: () =>
      fetchPageOperatorAuthority({
        resCodeList: Object.keys(MERCHANT_DETAIL_AUTH),
      }),
  })

  const {
    data: userInfo,
  } = useToastQuery({
    queryKey: ['userInfo'],
    queryFn: getCurrentUser,
  })

  const { data: authDetailList = [], refetch: authRefetch } = useToastQuery({
    queryKey: ['getAuthList'],
    async queryFn () {
      const res = await getAuthList({
        id: Number(accountId),
      })
      return res?.list
    },
  })

  const getModalView = (deleteResult) => {
    const { operateType, failReason, extData } = deleteResult
    // || {
    //   operateType: 'CONTACT_PM',
    //   failReason: 'HAS_PROFIT_CONTRACT',
    //   extData: {
    //     contractId: 1,
    //     contractStatusName: 1,
    //     makeStatusName: 1,
    //     makeId: 1,
    //   },
    // }
    const { contractId } = extData || {}
    const reason = unbaleDelContractReason({ extData })[failReason]
    const operate = unbaleDelContractGuide({ extData })[operateType]
    Dialog.confirm({
      title: '温馨提示',
      content: (
        <div>
          <div className="text-center text-[#f80219] mb-[10px]">
            当前认证信息无法删除
          </div>
          <div className="mt-[10px]">
            <p className="mt-5 text-center">
              <strong>原因</strong>：<span>{reason}</span>
            </p>
          </div>
          <div className="mt-[10px]">
            {Array.isArray(operate)
              ? (
                operate.map((item, index) => {
                  return (
                    <p key={index} className="mt-5 text-center">
                      <span style={{ color: '#333' }}>
                        第{numberMap[index + 1]}步
                      </span>
                      ：<span style={{ whiteSpace: 'pre-wrap' }}>{item}</span>
                    </p>
                  )
                })
              )
              : (
                <p className="mt-5 text-center">
                  <span>{operate}</span>
                </p>
              )}
            <br />
          </div>
        </div>
      ),
      cancelText: (
        <span className="text-[#585858]">
          {operateType === 'STOP_NORMAL_PROFIT_CONTRACT' ? '暂不处理' : '取消'}
        </span>
      ),
      confirmText:
        operateType === 'STOP_NORMAL_PROFIT_CONTRACT' ? '终止合同' : '我知道了',
      closeOnMaskClick: true,
      onConfirm () {
        if (operateType === 'STOP_NORMAL_PROFIT_CONTRACT') {
          navigator.href(targetApplication, {
            pathname: `/contract/termination/${contractId}?from=6`,
          })
        }
      },
    })
  }
  // 删除认证记录
  const { mutate: deleteIdentifyInfoMutate } = useToastMutation({
    mutationFn: deleteIdentifyInfo,
    onSuccess (res) {
      if (res) {
        const { pass } = res
        if (pass) {
          Toast.show('删除成功')
          authRefetch()
        } else {
          getModalView(res)
        }
      }
    },
  })

  // 重新注册CA认证
  const { mutate: reSignCAMutate } = useToastMutation({
    mutationFn: registerCA,
    onSuccess (res) {
      if (res) {
        Toast.show('申请成功')
        authRefetch()
      } else {
        Toast.show(res.msg)
      }
    },
  })

  const reSignCA = (item) => {
    reSignCAMutate(item.id)
  }
  const confirmRenling = (id) => {
    Dialog.confirm({
      content: '是否删除此认证',
      cancelText: <span className="text-[#585858]">取消</span>,
      confirmText: '确定',
      closeOnMaskClick: true,
      onConfirm () {
        if (id) {
          deleteIdentifyInfoMutate({
            id,
          })
        } else {
          Toast.show('认证数据异常')
        }
      },
    })
  }
  // 只有电小代有
  const autoCopy = (item) => {
    const { type, images } = item
    if (type === 1) {
      const companySide = images.filter(i => i.fileName === '营业执照')?.[0]
        ?.fileUrl
      if (!companySide) {
        Toast.show('没有营业执照')
        return
      }
      navigator.href('mammon', {
        pathname: `/crm/customer-agent/${accountId}/auth-firm?companySide=${companySide}`,
      })
    } else {
      const positive = images.filter(i => i.fileName === '身份证正面')?.[0]
        ?.fileUrl
      const otherSide = images.filter(i => i.fileName === '身份证反面')?.[0]
        ?.fileUrl
      if (!positive) {
        Toast.show('没有身份证国徽页照片')
        return
      }
      if (!otherSide) {
        Toast.show('没有身份证人像页照片')
        return
      }
      navigator.href('mammon', {
        pathname: `/crm/customer-agent/${accountId}/auth-personal?positive=${positive}&otherSide=${otherSide}`,
      })
    }
  }

  const baseContent = [
    {
      label: '商户名称',
      value: basicDetail.name,
    },
    {
      label: '商户ID',
      value: (
        <CopyToClipboard
          text={basicDetail.merchantId}
          onCopy={() => {
            Toast.show('复制成功')
          }}
        >
          <span
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="text-[#1e1e1e]"
          >
            {basicDetail.merchantId}
            <IconSVG
              symbol="icon-xianxing_fuzhi"
              className="w-[16px] ml-[2px]"
              style={{ marginLeft: '2px', color: '#0FB269' }}
            />
          </span>
        </CopyToClipboard>
      ),
    },
    {
      label: '联系人',
      value: basicDetail.contactName,
    },
    {
      label: '商户联系电话',
      value: (
        <span
          className="text-[#0FB269]"
          style={{ textDecoration: 'underline' }}
        >
          {
              open
                ? <a href={`tel:${basicDetail?.contactMobile}`}>{basicDetail?.contactMobile}</a>
                : basicDetail?.contactMobile &&
               `${basicDetail?.contactMobile?.substring(0, 3)}* * * *${basicDetail?.contactMobile?.substring(basicDetail?.contactMobile?.length - 4)}`
            }
          <IconSVG
            symbol={!open ? 'icon-xianxing_bukejian' : 'icon-xianxing_kejian'}
            className="w-[16px] ml-[2px]"
            style={{ marginLeft: '2px', color: '#0FB269' }}
            onClick={debounce(
              () => {
                setOpen(!open)
                readnSensitiveMutate({
                  dataType: 'phone',
                  maskingData: basicDetail.contactMobile,
                  encryptDataStr: undefined,
                  requestPageUrl: window.location.pathname,
                  requestPageTitle: document.title,
                })
              },
              500,
            )}
          />
        </span>
      ),
    },
    {
      label: '商户负责人',
      value: basicDetail.managerName,
    },
  ]

  const statusTag = (item) => {
    if (item.status === 2) {
      if (item.transferTag === 1) {
        return (
          <div className="flex items-center text-[12px] text-[#fff] h-[21px] bg-[red] px-[4px] rounded-[4px] mx-[4px]">
            老迁新
          </div>
        )
      }
      return (
        <div className="flex items-center text-[12px] text-[#fff] h-[21px] bg-[#0FB269] px-[4px] rounded-[4px] mx-[4px]">
          已认证
        </div>
      )
    } else if (item.status === 1) {
      return (
        <div className="flex items-center text-[12px] text-[#fff] h-[21px] bg-[#F56A07] px-[4px] rounded-[4px] mx-[4px]">
          认证中
        </div>
      )
    } else if (item.status === -1) {
      return (
        <div className="flex items-center text-[12px] text-[#fff] h-[21px] bg-[red] px-[4px] rounded-[4px] mx-[4px]">
          认证失败
        </div>
      )
    }
  }
  const authItemView = (item: any, type:number) => {
    return (
      <div className="mt-2" key={item.id}>
        <div className="p-3 rounded-xl bg-[#F8F8F8]">
          <div className="flex justify-between items-center text-[#1E1E1E] h-[21px]">
            <div className="flex font-medium text-[#1E1E1E] text-[14px]">
              <div className="mr-[4px] font-bold">
                {item.typeStr}认证
              </div>
              {statusTag(item)}
              {item.ruleTmpCode === 'AGENT_TEMPLATE_II' && (
                <div className="flex items-center text-[12px] text-[#fff] h-[21px] bg-[#0FB269] px-[4px] rounded-[4px] mx-[4px]">
                  简版
                </div>
              )}
            </div>
            {type === 2
              ? (
                ((merchantDetailPermissions?.['1.2.6.2'] && isSameManager) || !merchantDetailPermissions?.['1.2.6.2']) && <div
                  className="text-[#0FB269] text-[12px]"
                  onClick={() => autoCopy(item)}
                >
                  <IconSVG
                    symbol="icon-xianxing_fuzhi"
                    className="mr-1 text-[#0FB269] w-[16px]"
                  />
                  复制到我的团队下
                </div>
              )
              : (
                (isHonor || (!isHonor && (((merchantDetailPermissions?.['1.2.6.1'] && isSameManager) || !merchantDetailPermissions?.['1.2.6.1'])))) &&
                  <div onClick={() => confirmRenling(item.id)}>
                    <IconSVG
                      symbol="icon-xianxing_shanchu"
                      className="text-[#848484] w-[16px]"
                    />
                  </div>
              )}
          </div>

          <div className="my-3 bg-[#E8E8E8] w-full h-[0.5px]" />

          {item.type === 1
            ? (
              <>
                <div className="flex justify-between text-[#1E1E1E]  mt-[12px]">
                  <div className="text-[14px] text-[#848484]">企业名称</div>
                  <div>{item.name}</div>
                </div>
                <div className="flex justify-between text-[#1E1E1E]  mt-[12px]">
                  <div className="text-[14px] text-[#848484]">
                    统一社会信用代码
                  </div>
                  <div>{item.certificateCode}</div>
                </div>
              </>
            )
            : (
              <>
                <div className="flex justify-between text-[#1E1E1E]  mt-[12px]">
                  <div className="text-[14px] text-[#848484]">姓名</div>
                  <div>{item.name}</div>
                </div>
                <div className="flex justify-between text-[#1E1E1E]  mt-[12px]">
                  <div className="text-[14px] text-[#848484]">身份证号</div>
                  <div>{item.userCode}</div>
                </div>
              </>
            )}
          {
        // 认证成功且注册失败可重新注册
          (isHonor && item.status === 2 && item.caResult === 3) &&
            <div className="text-right">
              <div className="bg-[#0FB269] mt-2 text-white inline-block text-[14px] px-2 py-1 rounded" onClick={() => reSignCA(item)}>
                进行CA认证
              </div>
            </div>
}
        </div>

      </div>
    )
  }

  const goAssociatedShopPage = () => {
    navigator.navigate({
      pathname: '/merchant/associated-shops',
      query: {
        merchantId: `${basicDetail?.merchantId}`,
      },
    })
  }
  const goContractManagePage = () => {
    navigator.href(targetApplication, {
      pathname: '/contract/list/merchant',
      query: {
        mobile: basicDetail.contactMobile,
      },
    })
  }
  const goAuthRecordPage = () => {
    navigator.navigate({
      pathname: '/auth/record',
      query: {
        merchantId: `${basicDetail?.merchantId}`,
        mchType: '1',
      },
    })
  }
  const goPersonAuthPage = () => {
    if (isHonor) {
      navigator.href(targetApplication, {
        pathname: '/crm/customer/auth-guide',
        query: {
          customerId: `${accountId}`,
          name: basicDetail.name,
          authType: '2', // 个人
        },
      })
    } else {
      navigator.href(targetApplication, {
        pathname: `/crm/customer-agent/${accountId}/auth-personal`,

      })
    }
  }
  const goCompanyAuthPage = () => {
    if (isHonor) {
      navigator.href(targetApplication, {
        pathname: '/crm/customer/auth-guide',
        query: {
          customerId: `${accountId}`,
          name: basicDetail.name,
          authType: '1', // 个人
        },
      })
    } else {
      navigator.href(targetApplication, {
        pathname: `/crm/customer-agent/${accountId}/auth-firm`,

      })
    }
  }

  const authTitleView = (title?: string) => {
    return (
      <div className="flex justify-between ">
        <div className="text-[16px] text-[#1E1E1E] font-bold">
          {title || '认证信息'}
        </div>
        <div
          className="flex text-[12px] text-[#848484] items-center"
          onClick={goAuthRecordPage}
        >
          认证记录
          <IconSVG
            symbol="icon-xianxing_you"
            className="w-[16px]"
            style={{ color: '#848484' }}
          />
        </div>
      </div>
    )
  }
  const [canPersonalAuth, canEnterpriseAuth] = useMemo(() => {
    const res = [true, true]
    authDetailList
      ?.filter(item => item.isDirectAuth === (isHonor ? 1 : 0))
      ?.forEach((item) => {
        if (item.type === 2) {
          res[0] = false
        } else if (item.type === 1) {
          res[1] = false
        }
      })
    return res
  }, [authDetailList])
  if (authLoading && isLoading) return <Loading />
  if (error) return <Error text={error?.msg || '数据异常'} />
  let authList = []
  let otherAuthList = []
  if (isHonor) {
    authList = authDetailList
  } else {
    authList = authDetailList?.filter(item => item.isDirectAuth !== 1)
    otherAuthList = authDetailList?.filter(item => item.isDirectAuth === 1)
  }
  const showAuthTip = !!authRecordList?.find(
    item => item.status === 'AUDITING',
  )

  return (
    <section className="h-screen w-full overflow-auto bg-[#F2F2F2] pb-24">
      {showAuthTip && (
        <div>
          <div className="h-[42px] w-full bg-[#F2F2F2]" />
          <div className="fixed bg-[#F2F2F2]  top-[0px] py-[8px] w-[100%] px-[8px] z-10">
            <div
              className="text-[#F56A07] relative overflow-hidden w-full py-2 rounded-lg flex px-3 bg-[#FFF4E6] items-center"
              onClick={goAuthRecordPage}
            >
              <IconSVG symbol="icon-a-xianxing_shuomingtishi" />
              <ul className="overflow-hidden w-full h-[inherit]">
                <li className="box-border w-full h-[inherit] text-xs leading-[18px] pl-2 pr-0 py-0;">
                  认证记录审核中，点击查看
                </li>
              </ul>
              <IconSVG symbol="icon-xianxing_you" />
            </div>
          </div>
        </div>
      )}
      <Card className="mx-[8px] mb-[8px] mt-2">
        <div className="flex h-[21px] items-center">
          <div className="text-[16px] font-bold text-[#1E1E1E] ">
            {basicDetail?.name}
          </div>
          {basicDetail?.authTags?.map(item => (
            <div
              key={item}
              className="flex items-center text-[12px] text-[#fff] h-[21px] bg-[#0FB269] px-[4px] rounded-[4px] ml-[4px]"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="items-center w-full flex h-[41px] text-[#585858] text-[12px] border border-solid border-[#e8e8e8] rounded mt-[12px]">
          <div className="w-full flex-1" onClick={goAssociatedShopPage}>
            <div className="flex justify-center h-[13px] items-center ">
              <IconSVG
                symbol="icon-xianxing_mendian"
                className="w-[16px]"
                style={{ color: '#0FB269' }}
              />
              <div className="text-[#0FB269] ml-[4px] mr-[9px] text-[12px]">
                关联门店数：{basicDetail?.shopNum}
              </div>
              <IconSVG
                symbol="icon-xianxing_you"
                className="w-[12px]"
                style={{ color: '#848484' }}
              />
            </div>
          </div>
          <div className="w-[0.5px] bg-[#E8E8E8] h-[12px] my-[14.5px]" />
          <div className="w-full flex-1" onClick={goContractManagePage}>
            <div className="flex justify-center h-[13px] items-center ">
              <IconSVG
                symbol="icon-hetong"
                className="w-[16px]"
                style={{ color: '#0FB269' }}
              />
              <div className="text-[#0FB269] ml-[4px] mr-[9px] text-[12px]">
                关联合同数：{basicDetail?.contractNum}
              </div>
              <IconSVG
                symbol="icon-xianxing_you"
                className="w-[12px]"
                style={{ color: '#848484' }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="mx-[8px] mb-[8px]">
        <div className="text-[16px] font-bold text-[#1E1E1E]">基本信息</div>
        <div className="my-3 bg-[#efefef] w-full h-[0.5px]" />
        <PaperContent loading={false} data={baseContent} align="between" />
      </Card>

      {authList?.length === 0 && otherAuthList?.length === 0
        ? <Card className="mx-[8px] mb-[8px]">
          {authTitleView()}

          <div className="my-3 bg-[#efefef] w-full h-[0.5px]" />
          <div className="mt-6">
            <Empty />
          </div>
        </Card>
        : (
          <>
            {authList?.length > 0 && (
              <Card className="mx-[8px] mb-[8px]">
                {authTitleView()}
                {/* 电小代和电小二都有 */}
                {authList?.map((item: any) => authItemView(item, 1))}
              </Card>
            )}

            {/* 其他认证信息，仅电小代有 */}
            {otherAuthList?.length > 0 && (
              <div className="auth-info rounded-lg p-3 text-[14px] text-[#1E1E1E] mx-[8px] bg-[#fff]">
                {authTitleView('其他团队的认证信息')}

                {otherAuthList.map((item: any) => authItemView(item, 2))}
              </div>
            )}
          </>
        )}

      {
     ((isHonor || (!isHonor &&
      (((merchantDetailPermissions?.['1.2.6.3'] && isSameManager) ||
      !merchantDetailPermissions?.['1.2.6.3'])))) &&
      (canPersonalAuth || canEnterpriseAuth)) &&
      (
        <div className="fixed w-full space-x-2  p-2 bottom-0 left-0 bg-white ">
          <div className="flex pb-7">
            {(isHonor ? (canPersonalAuth && userInfo?.isVentureCompany) : canPersonalAuth) &&
              <Button
                size="large"
                color="primary"
                type="submit"
                className={classnames(
                  'flex-1 rounded-1',
                  canPersonalAuth && canEnterpriseAuth
                    ? ' bg-white text-[#0FB269] border-[#0FB269] mr-2'
                    : '',
                )}
                onClick={goPersonAuthPage}
              >
                添加个人认证
              </Button>}
            {canEnterpriseAuth && (
              <Button
                size="large"
                color="primary"
                type="submit"
                className="flex-1 rounded-1"
                onClick={goCompanyAuthPage}
              >
                添加企业认证
              </Button>
            )}
          </div>
        </div>
      )
}
    </section>
  )
}
