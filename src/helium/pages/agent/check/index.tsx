import { useState } from 'react'
import { Card, Toast, Button, Popup, NoticeBar } from 'antd-mobile'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useToastMutation } from '@/common/hooks/react-query'
import { fetchAgentBasicInfo, fetchSMSCode, fetchSMSCodeCheck } from './api'
import { PaperContent } from '@/common/components/paper'
import { IconSVG } from '@/common/components/icon-svg'
import { isPhone } from '@/pages/agent/check/varify'
import { useRouter } from '@/common/hooks/use-router'
import { useInterval } from '@/common/hooks/use-interval'
import { useForm } from 'react-hook-form'
import {
  FormContainer,
  InputField,
} from '@/common/components/form'
import { isMobilePhone } from '@/common/utils/validator'

interface AgentInfo {
  tip?: string
  agentName?: string
  agentId?: number
  managerName?: string
  managerId?: number
}

interface FieldContent {
  label: string;
  value: string;
  hide?: boolean;
  onClick?: () => void;
}

type Mobile = string

const COUNTDOWN = 60

export default function AgentCheck () {
  const form = useForm()
  const { navigator, searchParams } = useRouter()
  const [visible, setVisible] = useState(false)
  const mobile = searchParams.get('mobile')

  const [count, setCount] = useState(COUNTDOWN)
  const [running, setRunning] = useState(false)

  useInterval(
    () => {
      if (count > 1) {
        setCount(count - 1)
      } else {
        setRunning(false)
      }
    },
    running ? 1000 : null,
  )

  const { mutate: fetchSMSCodeMutation } = useToastMutation({
    mutationFn: (values: any) => fetchSMSCode(values),
    onSuccess () {
      setCount(COUNTDOWN)
      setRunning(true)
      Toast.show('发送成功')
    },
  })

  const {
    mutate: fetchAgentBasicInfoMutation,
    data: existAgentList,
  } = useToastMutation<AgentInfo[], any, { mobile: Mobile }>({
    mutationFn (values) {
      return fetchAgentBasicInfo(values)
    },
    onSuccess (res, { mobile }) {
      // 如果没有返回值则直接发送验证码
      if (res?.length === 0) {
        fetchSMSCodeMutation({ mobile, bizType: 500, accountId: '0' })
        return
      }
      // 如果有返回值 弹框显示需要提醒的
      setVisible(true)
    },
  })

  const { mutate: fetchSMSCodeCheckMutation } = useToastMutation({
    mutationFn (values: any) {
      return fetchSMSCodeCheck({ ...values, bizType: 500 })
    },
    onSuccess (_, { mobile }) {
      navigator.navigate({
        pathname: '/agent/create',
        query: {
          mobile: mobile ?? '',
        },
      })
    },
  })

  const contentFields = (item) => {
    const fields: FieldContent[] = [
      {
        label: '代理商ID',
        value: <CopyToClipboard
          text={item.agentId}
          onCopy={() => {
            Toast.show('复制成功')
          }}
        >
          <span onClick={(e) => {
            e.stopPropagation()
          }}
          >{item.agentId} <IconSVG symbol="icon-xianxing_fuzhi" className="w-[16px] ml-1" style={{ marginLeft: '2px', color: '#0FB269' }} /></span>
        </CopyToClipboard>,
      },
      {
        label: '客户经理',
        value: item.managerName || '暂无',
      },
    ]
    return fields
  }

  const onSubmit = (values) => {
    const { mobile, code } = values
    if (!mobile) {
      return
    }
    if (!isPhone(mobile.trim())) return Toast.show('请输入正确手机号')

    fetchSMSCodeCheckMutation({
      mobile,
      code,
    })
  }

  const handleSendCode = () => {
    const values = form.getValues()
    const { mobile } = values
    if (!mobile) {
      return
    }
    if (!isPhone(mobile.trim())) return Toast.show('请输入正确手机号')
    const params = {
      mobile,
      source: '1',
    }
    fetchAgentBasicInfoMutation(params)
  }

  return (
    <section className="h-screen w-full overflow-auto bg-[#F2F2F2]">
      <NoticeBar content="请先输入代理商登陆手机号查询" color="alert" />
      <FormContainer
        className="mb-16"
        form={form}
        onSuccess={onSubmit}
      >
        <InputField
          required
          label="代理商手机号"
          name="mobile"
          rules={{
            validate: val => isMobilePhone(val) || '请输入正确的手机号',
          }}
          defaultValue={mobile || ''}
          placeholder="输入代理商登录手机号"
        />
        <div className="flex">
          <div className="grow">
            <InputField
              required
              label="验证码"
              name="code"
              placeholder="输入验证码"
            />
          </div>
          <Button
            fill="none"
            color="primary"
            onClick={handleSendCode}
            disabled={running}
            className="min-w-[120px]"
          >
            {running ? `重新发送 ${count}` : '获取验证码'}
          </Button>
        </div>
        <div className="p-2">
          <Button
            block
            size="large"
            type="submit"
            color="primary"
          >
            确定
          </Button>
        </div>
      </FormContainer>
      {/* )} */}

      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        onClose={() => {
          setVisible(false)
        }}
        bodyStyle={{ backgroundColor: '#efefef' }}
        showCloseButton
      >
        <h4 className="text-base font-bold text-center my-2">代理商重复提示</h4>
        <section className="form-wrap p-2 overflow-y-auto h-[60vh] pb-16">
          {
            existAgentList?.map(agent => <Card
              key={agent.agentId}
              className="text-[#1E1E1E] text-base mb-2"
            >
              <div className="font-medium mb-1">
                {agent.agentName}
              </div>

              <PaperContent
                loading={false}
                data={contentFields(agent)}
              />
              <NoticeBar
                className="mt-1"
                content={agent.tip} color="alert" style={{
                  '--font-size': '13px',
                }}
              />
            </Card>)
          }
        </section>

        <div className="flex gap-2 fixed bottom-0 w-full p-2 bg-white">
          <Button
            block onClick={() => {
              setVisible(false)
              navigator.navigate(-1)
            }}
          >返回列表</Button>
          <Button
            block color="primary" onClick={() => {
              setVisible(false)
              fetchSMSCodeMutation({ mobile: form.getValues().mobile, bizType: 500, accountId: '0' })
            }}
          >继续提交</Button>
        </div>
      </Popup>
    </section>
  )
}
