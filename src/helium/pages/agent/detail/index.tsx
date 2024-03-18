import { useState, useEffect } from 'react'
import { useToastQuery, useToastMutation } from '@/common/hooks/react-query'
import {
  Card,
  Toast,
  Divider,
  Button,
  Tag,
  Image,
  Space,
  ImageViewer,
  Dialog,
  Input,
} from 'antd-mobile'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { IconSVG } from '@/common/components/icon-svg'
import { PaperContent, PaperFooter } from '@/common/components/paper'
import Tip from '@/common/components/tips'
import { useRouter } from '@/common/hooks/use-router'
import { useParams } from 'react-router-dom'
import { isNumber } from 'lodash'
import {
  fetchAgentDetail,
  updateAgentAccountStatus,
  deleteIdentifyInfo,
  fetchPageOperatorAuthority,
  fetchAuthRecordList,
  setAgentRatio,
  getChanelManagerRatioGrayList,
  checkAgentFeeRateExits,
} from './api'
import Error from '@/common/components/error'
import { AGENT_DETAIL_AUTH } from '@/common/constants/index'
import { dayjs } from '@dian/app-utils'
import { Loading } from '@/common/components/loading'
import './index.css'

/**
 * 类型
 */
export const enum AgentSubType {
  /**
   * 企业
   */
  Enterprise = 1,
  /**
   * 个人
   */
  Personal = 2,
}

export const typeNameMapping = {
  [AgentSubType.Enterprise]: '企业',
  [AgentSubType.Personal]: '个人',
}

interface BasicData {
  id: number
  agentId: number;
  type: number;
  typeStr: string;
  mobile: string;
  subType: number;
  subTypeStr: string;
  agentLevelStr: string;
  agentAreasStr: string;
  managerName: string;
  agentAddress: string;
  agentAccountStatus: number;
  agentName: string;
  manageBelongOwn: boolean;
  hierarchy: number;
  withdrawRatio: number;
  agentStatus: number;
  isSign: boolean
}

interface AgentDetailData {
  basicData: BasicData;
  authList: any;
  bankInfo: any;
  contractInfo: any;
}

export default function AgentDetail () {
  const [showBigImage, setShowBigImage] = useState(false)
  const params = useParams()
  const [curIndexUrl, setCurIndexUrl] = useState('')
  const { navigator } = useRouter()
  const [showFeeInput, setShowFeeInput] = useState(false)
  const [ratioValue, setRatioValue] = useState<string>('0')
  let inputRef:any = {}

  useEffect(() => {
    if (inputRef?.focus) {
      inputRef.focus()
    }
  }, [inputRef])

  // 获取权限
  const { data: authorityData } = useToastQuery({
    queryKey: ['fetchAgentDetailAuthority'],
    queryFn: () =>
      fetchPageOperatorAuthority({
        resCodeList: Object.keys(AGENT_DETAIL_AUTH),
      }),
  })

  const { data: hasRatioGray } = useToastQuery({
    queryKey: ['getChanelManagerRatioGrayList'],
    queryFn: () => getChanelManagerRatioGrayList({}),
  })

  const { mutate: checkAgentFeeRateExitsMutate, data: feeInfo } = useToastMutation({
    mutationFn: checkAgentFeeRateExits,
  })

  // 获取认证列表
  const { mutate: fetchAuthRecordListMutate, data: recordList } = useToastMutation({
    mutationFn: fetchAuthRecordList,
  })

  const { data, refetch, error, isLoading } = useToastQuery({
    queryKey: ['fetchAgentDetail'],
    queryFn: () =>
      fetchAgentDetail({
        id: params.id,
      }),
    onSuccess ({ basicData }) {
      if (basicData?.agentId) {
        fetchAuthRecordListMutate({
          merchantId: basicData.agentId,
          mchType: 3,
        })
        setRatioValue(basicData.withdrawRatio || 0)
      }
    },
  })

  const { mutate: updateAgentAccountStatusMutate } = useToastMutation({
    mutationFn: updateAgentAccountStatus,
    onSuccess () {
      // 跳转到列表页
      Toast.show('操作成功')
      refetch()
    },
  })

  const { mutate: deleteIdentifyInfoMutate } = useToastMutation({
    mutationFn: deleteIdentifyInfo,
    onSuccess () {
      // 跳转到列表页
      Toast.show('操作成功')
      refetch()
    },
  })

  // 设置费率
  const { mutate: setAgentRatioMutate } = useToastMutation({
    mutationFn: setAgentRatio,
    onSuccess () {
      // 跳转到列表页
      Toast.show('操作成功')
      setShowFeeInput(false)
      refetch()
    },
  })

  useEffect(() => {
    if (feeInfo?.exist === false) {
      navigator.navigate({
        pathname: '/agent/change-sharing',
        query: {
          agentId: `${params.id}`,
          feeRate: data?.basicData?.feeRate,
        },
      })
    }

    if (feeInfo?.exist === true) {
      Dialog.confirm({
        header: '温馨提示',
        content: (
          <div
            style={{ color: '#585858', fontSize: '14px', textAlign: 'center' }}
          >您有一个变更分成的申请正在审批中，流程ID：{feeInfo.processId || ''},
            如需重新变更，可以撤回该流程或者等该流程审批结束后重新发起！
          </div>
        ),
        closeOnMaskClick: true,
        cancelText: <span className="text-[#585858]">取消</span>,
        confirmText: '查看审批',
        onConfirm () {
          navigator.href('indra', {
            pathname: '/task-new-detail',
            query: {
              businessId: data?.basicData?.agentId,
              processInstanceId: feeInfo.processId,
            },
          })
        },
      })
    }
  }, [data?.basicData?.feeRate, feeInfo, navigator, params.id])

  if (data === undefined) {
    return <Loading />
  }

  const openImgModal = (url) => {
    setCurIndexUrl(url)
    setShowBigImage(true)
  }

  const renderVisitImg = (data) => {
    if (!data) {
      return
    }
    return data.map((it, index) => {
      return (
        <Image
          key={index}
          onClick={() => openImgModal(it.fileUrl)}
          src={it.fileUrl}
          width={64}
          height={64}
          fit="fill"
        />
      )
    })
  }

  const handleDeleteAuth = (subjectId: number) => {
    Dialog.confirm({
      content: '是否删除此认证',
      cancelText: <span className="text-[#585858]">取消</span>,
      confirmText: '确定',
      closeOnMaskClick: true,
      onConfirm () {
        if (subjectId) {
          deleteIdentifyInfoMutate({
            subjectId,
          })
        } else {
          Toast.show('认证数据异常')
        }
      },
    })
  }

  const {
    basicData,
    authList,
    bankInfo = {},
    contractInfo = {},
  } = data as AgentDetailData

  const baseContent = [
    {
      label: '渠道商类型',
      value: basicData.typeStr,
    },
    {
      label: '登录手机号',
      value: <span className="text-primary underline">{basicData.mobile}</span>,
    },
    { label: '代理商性质', value: basicData.subTypeStr },
    { label: '代理商级别', value: basicData.agentLevelStr },
    { label: '详细地址', value: basicData.agentAddress },
    { label: '代理区域', value: basicData.agentAreasStr },
    { label: '负责客户经理', value: basicData.managerName },
    { label: '提现费率', value: isNumber(basicData.withdrawRatio) ? `${basicData.withdrawRatio}%` : '--', hide: basicData.hierarchy !== 2 },
  ]

  const renderAuthField = (item) => {
    const authContent = [
      {
        label: '认证状态',
        value: <Tag color={item.tagType || 'warning'}>{item.statusStr}</Tag>,
        hide: !item.statusStr,
      },
      { label: '认证主体类型', value: item.typeStr },
      { label: '企业名称', value: item.name, hide: item.type === 2 },
      { label: '姓名', value: item.name, hide: item.type === 1 },
      {
        label: '统一社会信用证代码',
        value: item.certificateCode,
        hide: !(
          item.type === 1 && item.certificateType === 'ENTERPRISE_LICENSE'
        ),
      },
      {
        label: '工商注册号',
        value: item.certificateCode,
        hide: !(
          item.type === 1 && item.certificateType === 'INDIVIDUAL_LICENSE'
        ),
      },
      { label: '身份证号', value: item.certificateCode, hide: item.type !== 2 },
      {
        label: '法人姓名',
        value: item.userName,
        hide: !(item.type === 1 && item.userType === 1),
      },
      {
        label: '法人身份证号',
        value: item.userCode,
        hide: !(item.type === 1 && item.userType === 1),
      },
      {
        label: '经办人姓名',
        value: item.contact,
        hide: !(item.type === 1 && item.userType === 2),
      },
      {
        label: '经办人身份证号',
        value: item.userCode,
        hide: !(item.type === 1 && item.userType === 2),
      },
      { label: '联系电话', value: item.contactTel },
      { label: '详细地址', value: item.contactAddr },
      { label: '是否注册CA证书', value: item.caFlag ? '是' : '否' },
      {
        label: '资质附件',
        value: <Space wrap>{renderVisitImg(item.files)}</Space>,
      },
    ]
    return authContent
  }

  const bankContent = [
    {
      label: '持卡人姓名',
      value: bankInfo.accountName,
    },
    {
      label: '银行卡类型',
      value: bankInfo.cardType === 1 ? '企业银行卡' : '个人银行卡',
    },
    {
      label: '身份证号码',
      value: bankInfo.idCardNo,
      hide: bankInfo.cardType === 1,
    },
    { label: '银行卡号', value: bankInfo.bankCardNo },
    { label: '开户银行', value: bankInfo.bankName },
    { label: '开户行省市', value: `${bankInfo.province} ${bankInfo.city}` },
    { label: '开户支行', value: bankInfo.bankBranchName },
  ]

  const contractContent = [
    {
      label: '合同ID',
      value: (
        <span
          className="text-primary underline" onClick={() => {
            navigator.href('honor', {
              pathname: `/contract/detail/${contractInfo.contractId}`,
            })
          }}
        >
          {contractInfo.contractId}
        </span>
      ),
    },
    { label: '合同状态', value: contractInfo.contractStatusDesc },
    { label: '合同类型', value: contractInfo.contractBizTypeDesc },
    { label: '分成比例', value: contractInfo.rateInfoStr, hide: basicData.hierarchy === 1 },
    { label: '合同时间', value: `${dayjs(contractInfo.effectTime).format('YYYY-MM-DD')}至${dayjs(contractInfo.invalidTime).format('YYYY-MM-DD')}` },
  ]

  const handleAgentStatusChange = (agentAccountStatus) => {
    Dialog.confirm({
      header: `${agentAccountStatus === 0 ? '确定冻结？' : '确定解冻？'}`,
      content: (
        <div
          style={{ color: '#585858', fontSize: '14px', textAlign: 'center' }}
        >{`${
          agentAccountStatus === 0
            ? '冻结后代理商下面所有账号将不允许登录'
            : '解冻后代理商下面所有账号将可登录'
        }`}</div>
      ),
      closeOnMaskClick: true,
      cancelText: <span className="text-[#585858]">取消</span>,
      onConfirm () {
        if (basicData.agentId) {
          updateAgentAccountStatusMutate({
            agentId: basicData.agentId,
            workState: agentAccountStatus,
          })
        } else {
          Toast.show('代理商信息异常')
        }
      },
    })
  }

  const handleBankList = () => {
    navigator.navigate({
      pathname: '/agent/bank/list',
      query: {
        agentId: `${basicData.agentId}`,
      },
    })
  }

  const handleAuthRecord = () => {
    navigator.navigate({
      pathname: '/auth/record',
      query: {
        merchantId: `${basicData.agentId}`,
        mchType: '3', // 代理商
      },
    })
  }

  const handleBillDetail = () => {
    navigator.navigate({
      pathname: '/capital-acount',
      query: {
        // queryChannelId: '19',
        queryChannelId: `${basicData.agentId}`,
        hierarchy: `${basicData.hierarchy}`,
      },
    })
  }

  const handleFeeInput = () => {
    setShowFeeInput(!showFeeInput)
  }

  const handleBlur = () => {
    // setShowFeeInput(false)
  }

  const handleSetFee = () => {
    if (ratioValue.indexOf('.') !== -1) {
      Toast.show('提现费率不支持小数')
      return
    }

    Dialog.confirm({
      header: '确认',
      content: (
        <div
          style={{ color: '#585858', fontSize: '14px', textAlign: 'center' }}
        >当前提现手续费为{ratioValue}%</div>
      ),
      closeOnMaskClick: true,
      cancelText: <span className="text-[#585858]">取消</span>,
      onConfirm () {
        if (basicData.agentId) {
          setAgentRatioMutate({ ratio: ratioValue, agentId: basicData.agentId })
        } else {
          Toast.show('代理商信息异常')
        }
      },
    })
  }

  if (isLoading) return <Loading />
  if (error) return <Error text="数据异常" />

  const showAuthTip = !!recordList?.find(item => item.status === 'AUDITING')

  return (
    <section className="h-screen w-full overflow-auto bg-[#F2F2F2] pb-16">
      {basicData.agentAccountStatus === 1 && (
        <div className="">
          <div className="h-[42px]" />
          <div className="fixed top-[8px] w-[100%] px-[8px] z-10">
            <Tip
              type="danger"
              desc="代理商已冻结，旗下所有账号不允许登录"
              style={{ borderRadius: '8px' }}
            />
          </div>
        </div>
      )}

      {basicData.agentAccountStatus !== 1 && showAuthTip && (
        <div className="">
          <div className="h-[42px]" />
          <div className="fixed top-[8px] w-[100%] px-[8px] z-10">
            <div
              className="text-[#F56A07] relative overflow-hidden w-full py-2 rounded-lg flex px-3 bg-[#FFF4E6] items-center"
              onClick={handleAuthRecord}
            >
              <IconSVG symbol="icon-a-xianxing_shuomingtishi" />
              <ul className="overflow-hidden w-full h-[inherit]">
                <li className="box-border w-full h-[inherit] text-xs leading-[18px] pl-2 pr-0 py-0;">认证记录审核中，点击查看</li>
              </ul>
              <IconSVG symbol="icon-xianxing_you" />
            </div>
          </div>
        </div>
      )}

      <Card className="mx-[8px] mb-[8px] mt-2">
        <div className="text-[16px] text-[#1E1E1E] font-medium">{basicData.agentName}</div>
        <div className="inline-block text-[#585858] text-[12px] border border-solid border-[#D9D9D9] rounded px-1 mt-[2px]">
          代理商ID：{basicData.agentId}
          <CopyToClipboard
            text={basicData.agentId}
            onCopy={() => {
              Toast.show('代理商ID已复制')
            }}
          >
            <IconSVG
              className="w-[14px] h-[14px] mb-1 ml-1"
              symbol="icon-xianxing_fuzhi"
            />
          </CopyToClipboard>
        </div>
      </Card>

      <Card className="mx-[8px] mb-[8px]">
        <div className="text-[16px] text-[#1E1E1E] font-medium">基本信息</div>
        <Divider className="my-3" />
        <PaperContent loading={false} data={baseContent} align="between" />
      </Card>

      {authList &&
          authList.map(item => (
            <Card key={item.subjectId} className="mx-[8px] mb-[8px]">
              <div className="text-[16px] text-[#1E1E1E] font-medium">认证信息
                <div
                  className="float-right font-normal text-sm text-[#848484] mt-1"
                  onClick={handleAuthRecord}
                >
                  查看记录
                  <IconSVG symbol="icon-xianxing_you" className="mb-1 ml-1" />
                </div>
              </div>
              <Divider className="my-3" />
              <PaperContent
                loading={false}
                data={renderAuthField(item)}
                align="between"
              />
              <PaperFooter
                button={[
                  {
                    label: '删除认证',
                    fill: 'outline',
                    onClick () {
                      handleDeleteAuth(item.subjectId)
                    },
                    hide:
                      item.approveStatus < 2 ||
                      !authorityData?.[AGENT_DETAIL_AUTH['1.2.2.5']] ||
                      !basicData.manageBelongOwn,
                  },
                  {
                    label: '查看详情',
                    fill: 'outline',
                    hide:
                      item.approveStatus > 1 ||
                      !authorityData?.[AGENT_DETAIL_AUTH['1.2.2.4']] ||
                      !basicData.manageBelongOwn,
                    onClick () {
                      navigator.href('indra', {
                        pathname: '/task-new-detail',
                        query: {
                          businessId: item.recordId,
                          processInstanceId: item.processInstanceId,
                        },
                      })
                    },
                  },
                ]}
              />
            </Card>
          ))}

      {/* 没有认证信息的情况 */}
      {authList.length < 1 && (
        <Card className="mx-[8px] mb-[8px]">
          <div className="text-[16px] text-[#1E1E1E] font-medium">认证信息
            <div
              className="float-right font-normal text-sm text-[#848484] mt-1"
              onClick={handleAuthRecord}
            >
              查看记录
              <IconSVG symbol="icon-xianxing_you" className="mb-1 ml-1" />
            </div></div>
          <PaperFooter
            button={[
              {
                label: '添加认证',
                fill: 'outline',
                onClick () {
                  navigator.href('honor', {
                    pathname: `/crm/customer-agent/${basicData.agentId}/auth-edit`,
                    query: {
                      name: `${basicData.agentName}`,
                      authType: `${basicData.subType}`,
                    },
                  })
                },
                hide: !authorityData?.[AGENT_DETAIL_AUTH['1.2.2.3']] || !basicData.manageBelongOwn,
              },
            ]}
          />
        </Card>
      )}

      <Card className="mx-[8px] mb-[8px]">
        <div className="text-[16px] text-[#1E1E1E] font-medium">
          银行卡信息
          {bankInfo.bankCardNo && (
            <div
              className="float-right font-normal text-sm text-[#848484] mt-1"
              onClick={handleBankList}
            >
              查看更多
              <IconSVG symbol="icon-xianxing_you" className="mb-1 ml-1" />
            </div>
          )}
        </div>
        {bankInfo.bankCardNo && (
          <>
            <Divider className="my-3" />
            <PaperContent
              loading={false}
              data={bankContent}
              align="between"
            />
          </>
        )}
        <PaperFooter
          button={[
            {
              label: '添加银行卡',
              fill: 'outline',
              hide:
                  !authorityData?.[AGENT_DETAIL_AUTH['1.2.2.6']] ||
                  !basicData.manageBelongOwn,
              onClick () {
                navigator.navigate({
                  pathname: '/agent/bank/create',
                  query: {
                    agentId: `${params.id}`,
                  },
                })
              },
            },
          ]}
        />
      </Card>

      <Card className="mx-[8px] mb-[8px]">
        <div className="text-[16px] text-[#1E1E1E] font-medium">
          代理商合同信息
        </div>
        <Divider className="my-3" />
        {contractInfo.contractId && (
          <PaperContent
            loading={false}
            data={contractContent}
            align="between"
          />
        )}
        <PaperFooter />
      </Card>

      <div className="fixed bottom-0 w-full p-2 bg-white flex items-center">
        {authorityData?.[AGENT_DETAIL_AUTH['1.2.2.2']] &&
            basicData.manageBelongOwn && (
              <div
                className="basis-1/4 flex-grow text-center"
                onClick={() =>
                  handleAgentStatusChange(basicData.agentAccountStatus)}
              >
                {basicData.agentAccountStatus === 0
                  ? (
                    <IconSVG symbol="icon-xianxing_suoding" color="#585858" />
                  )
                  : (
                    <IconSVG symbol="icon-xianxing_weisuoding" color="#585858" />
                  )}
                <p>{basicData.agentAccountStatus === 0 ? '冻结' : '解冻'}</p>
              </div>
        )}

        {authorityData?.[AGENT_DETAIL_AUTH['1.2.2.9']] && basicData.manageBelongOwn && (
          <div
            className="basis-1/4 flex-grow text-center"
            onClick={handleBillDetail}
          >
            <IconSVG
              symbol="icon-xianxing_shuju2"
              color="#585858"
              className="mr-1"
            />
            <p>账单</p>
          </div>
        )}

        {basicData.hierarchy === 2 && hasRatioGray && basicData.manageBelongOwn && (
          <div
            className="basis-1/4 flex-grow text-center"
            onClick={handleFeeInput}
          >
            <IconSVG
              symbol="icon-xianxing_shuju2"
              color="#585858"
            />
            <p>费率</p>
          </div>
        )}

        {/* <Button
            className="flex-[22%] h-10"
            disabled={!authorityData?.[AGENT_DETAIL_AUTH['1.2.2.8']]}
          >
            设备&门店转移
          </Button> */}
        {authorityData?.[AGENT_DETAIL_AUTH['1.2.2.7']] && (
          <Button
            disabled={!authorityData?.[AGENT_DETAIL_AUTH['1.2.2.7']]}
            className="basis-1/4 flex-grow h-10 ml-2"
            onClick={() => {
              navigator.href('honor', {
                pathname: '/crm/customer/assign',
                query: {
                  id: `${basicData.agentId}`,
                  type: 'agent',
                  oldAgent: `${basicData.agentId}`,
                  from: 'agentList',
                },
              })
            }}
          >
            分配
          </Button>
        )}
        {(authorityData?.[AGENT_DETAIL_AUTH['1.2.2.10']] && basicData.agentStatus === 2 && basicData.isSign) && (
          <Button
            color="primary"
            className="basis-1/4 flex-grow h-10 ml-2"
            onClick={() => {
              checkAgentFeeRateExitsMutate({
                agentId: basicData.agentId,
              })
            }}
          >
            变更分成
          </Button>
        )}
      </div>

      {
      showFeeInput && <div className="fixed bottom-0 w-full p-2 bg-white flex items-center justify-between ratio-input">
        <div>提现费率修改</div>
        <Input
          type="number"
          ref={(el) => {
            inputRef = el
          }}
          value={ratioValue}
          max={13}
          min={0}
          onBlur={handleBlur}
          onChange={(e) => {
            setRatioValue(e)
          }}
          className="w-[45%] border-[1px] border-solid border-[#E8E8E8] mx-2 px-2 h-[40px] rounded"
        />
        <Button
          color="primary"
          onClick={handleSetFee}
        >确定</Button>

        <IconSVG
          className="w-[20px] h-[20px] mb-[10px] my-2" symbol="icon-xianxing_guanbi" data-type="close" onClick={(e) => {
            e.stopPropagation()
            setShowFeeInput(false)
          }}
        />
      </div>
    }

      {showBigImage && (
        <ImageViewer
          image={curIndexUrl}
          visible={showBigImage}
          onClose={() => setShowBigImage(false)}
        />
      )}
    </section>
  )
}
