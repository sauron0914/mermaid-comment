import { useState } from 'react'
import {
  Card,
  Divider,
  Tag,
  Image,
  Space,
  ImageViewer,
  Button,
} from 'antd-mobile'
import { useToastQuery } from '@/common/hooks/react-query'
import { useRouter } from '@/common/hooks/use-router'
import { Loading } from '@/common/components/loading'
import Error from '@/common/components/error'
import { PaperContent } from '@/common/components/paper'
import { fetchAuthRecordDetail } from './api'
import Empty from '@/common/components/empty'
import Tip from '@/common/components/tips'

const CertificateTypes = {
  1: '企业营业执照',
  2: '个体工商营业执照',
  3: '身份证',
  4: '医疗许可证',
}

export default function AgentauthRecordList () {
  const { navigator, searchParams } = useRouter()
  const [showBigImage, setShowBigImage] = useState(false)
  const [curIndexUrl, setCurIndexUrl] = useState('')

  const {
    data: authRecord,
    isLoading,
    error,
  } = useToastQuery({
    queryKey: ['fetchAuthRecordDetail'],
    queryFn: () => fetchAuthRecordDetail({
      recordId: searchParams.get('recordId'),
    }),
  })

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

  const getColor = (target) => {
    // WAIT_AUDIT(0, "待审批"),
    // AUDITING(1, "审批中"),
    // AUDIT_PASS(3, "审批通过"),
    // AUDIT_REFUSE(4, "审批拒绝"),
    // AUDIT_CANCEL(5, "审批撤回");
    if (['WAIT_AUDIT', 'AUDITING'].includes(target)) {
      return 'warning'
    }
    if (['AUDIT_PASS'].includes(target)) {
      return 'success'
    }
    if (['AUDIT_REFUSE', 'AUDIT_REFUSE'].includes(target)) {
      return 'danger'
    }
  }

  const renderAuthField = (item) => {
    const getCompanyOptions = [
      {
        label: '认证状态',
        value: <Tag color={getColor(item.recordStatus)}>{item.recordStatusStr}</Tag>,
        hide: !item.recordStatusStr,
      },
      {
        label: '认证主体类型',
        value: '企业',
      },
      {
        label: '营业执照类型',
        value: CertificateTypes[item.certificateType],
      },
      {
        label: '企业名称',
        value: item.name,
      },
      {
        label: '社会统一信用证代码',
        value: item.certificateCode,
      },
      {
        label: '营业执照备案图片',
        value: <Space wrap>{renderVisitImg(item.images)}</Space>,
      },
    ]

    const getPersonOptions = [
      {
        label: '认证状态',
        value: <Tag color={getColor(item.recordStatus)}>{item.recordStatusStr}</Tag>,
        hide: !item.recordStatusStr,
      },
      {
        label: '认证主体类型',
        value: '个人',
      },
      {
        label: '老板姓名',
        value: item.name,
      },
      {
        label: '身份证号码',
        value: item.certificateCode,
      },
      {
        label: '身份证人像页照片',
        value: <Space wrap>{renderVisitImg(item.images.filter(i => i.fileName === '身份证正面') || [])}</Space>,
      },
      {
        label: '身份证国徽页照片',
        value: <Space wrap>{renderVisitImg(item.images.filter(i => i.fileName === '身份证反面') || [])}</Space>,
      },
    ]

    const authContent = [
      {
        label: '认证状态',
        value: <Tag color={getColor(item.recordStatus)}>{item.recordStatusStr}</Tag>,
        hide: !item.recordStatusStr,
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
        value: <Space wrap>{renderVisitImg(item.images)}</Space>,
      },
    ]

    if (item.ruleTmpCode === 'AGENT_TEMPLATE_II') {
      if (item.type === 1) {
        return getCompanyOptions
      }
      return getPersonOptions
    }
    return authContent
  }

  const goApprovalDetail = (data) => {
    const {
      recordId: businessId,
      processNo: processInstanceId,
      isNewApproval,
    } = data
    if (isNewApproval) {
      navigator.href('indra', {
        pathname: '/task-new-detail',
        query: {
          businessId: businessId,
          processInstanceId: processInstanceId,
          processType: 'newSystemshopAuthenticationProcess',
        },
      })
    } else {
      // todo: 跳转老审批
      navigator.href('indra', {
        pathname: '/taskDetail-old',
        query: {
          businessId: businessId,
          processInstanceId: processInstanceId,
          processType: 'customerAuthenticationProcess',
        },
      })
    }
  }

  if (isLoading && authRecord) return <Loading />
  if (isLoading) return <Loading />
  if (error) return <Error text="数据异常" />

  return (
    <section className="h-screen w-full overflow-auto bg-[#F2F2F2] pt-2 pb-16">

      {
          authRecord.status === 'FAIL' && authRecord.approvalRemarks &&
            <div className="">
              <div className="h-[42px]" />
              <div className="fixed top-[8px] w-[100%] px-[8px] z-10">
                <Tip
                  type="danger"
                  desc={`认证失败，请重新提交；失败原因：${authRecord.approvalRemarks}`}
                  style={{ borderRadius: '8px' }}
                />
              </div>
            </div>
      }

      {
        authRecord
          ? <Card key={authRecord.subjectId} className="mx-[8px] mb-[8px]">
            <div className="text-[16px] text-[#1E1E1E] font-medium">认证信息</div>
            <Divider className="my-3" />
            <PaperContent
              loading={false}
              data={renderAuthField(authRecord)}
              align="between"
            />
          </Card>
          : <Empty text="暂无数据" />
      }

      {showBigImage && (
        <ImageViewer
          image={curIndexUrl}
          visible={showBigImage}
          onClose={() => setShowBigImage(false)}
        />
      )}

      {
        ['WAIT_AUDIT', 'AUDITING', 'AUDIT_REFUSE'].includes(authRecord.recordStatus) && <div className="fixed w-full flex p-2 bottom-0 left-0  bg-white space-x-2">
          <Button
            block
            fill="outline"
            size="large"
            color="primary"
            type="submit"
            onClick={() => {
              goApprovalDetail(authRecord)
            }}
          >
            查看审批
          </Button>
        </div>
      }

    </section>
  )
}
