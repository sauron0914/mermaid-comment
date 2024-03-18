import { useRef } from 'react'
import { useRouter } from '@dian/app-utils/router'
import { Loading } from '@/common/components/loading'
import Empty, { EmptyType } from '@/common/components/empty'
import {
  getRoleLink,
  autoRules,
  namekRules,
  useRoleConfirmEffect,
} from './utils'
import { setLoginRole, setRoleType } from '@/common/utils/storage'

import { useRoles, useSelectRole } from './api'
import type { DropdownRef } from 'antd-mobile'
import { Button, Dropdown, Form, Radio } from 'antd-mobile'

import './index.css'
import { CheckCircleFill } from 'antd-mobile-icons'
import { BLS, isLocalEnv } from '@dian/app-utils'
import type { Tenant } from './types'
import { FUWU_ROLES_LIST } from './utils/constants'
import { getWatermark } from '@/common/utils/watermark'
import { GlobalContainer } from '@/common/store'

const bls = new BLS({ namespace: 'hydrogen/login' })

const Roles = () => {
  const { navigator, searchParams } = useRouter()
  const [form] = Form.useForm()
  const dropdownRef = useRef<DropdownRef>(null)
  const from = searchParams.get('from')
  const fromRef = useRef(from)
  const container = GlobalContainer.useContainer()

  const { confirm } = useRoleConfirmEffect()

  const navigateTo = (
    roleCode: string,
    roleType: number,
    departmentId: number,
    agentBizType: number,
  ) => {
    setLoginRole(roleCode)
    // 拜访门店 用于区分bdm roletype === 2, cm roleType === 3
    setRoleType(roleType)
    const isAgent = !(agentBizType === 110 || agentBizType === 150)
    const link = getRoleLink(roleCode, departmentId, from, isAgent)
    container.setWatermark(getWatermark())

    if (link.app === 'hydrogen') {
      navigator.navigate(link.to, { replace: true })
    } else {
      // 本地开发不跳转
      if (isLocalEnv()) {
      // eslint-disable-next-line no-console
        console.log(link)
        return
      }
      navigator.href(link.app as any, link.to as any, {
        replace: link.replace ?? false,
      })
    }
  }

  const { data: tenantList, isLoading } = useRoles({
    onSuccess (data) {
      // 租户数量1时 检查是否有自动跳转逻辑可执行
      if (data.length === 1 && data?.[0].status !== 0) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        oneTenantNavigate(data[0])
      }
      // 默认选中上次选的租户 或 第一个状态可用的租户
      const defaultTenant =
        data.find(o => o.tenantId === bls.get('latestTenantId') && o.status !== 0) ??
        data.find(o => o.status !== 0)
      if (defaultTenant && defaultTenant.status !== 0) {
        form.setFieldValue('tenantId', defaultTenant.tenantId)
      }
    },
  })

  const getTenant = (tenantId: string): Tenant | undefined => {
    if (!tenantList) return
    return tenantList?.find(o => o.tenantId === tenantId)
  }

  const { mutate: selectRoleMutate } = useSelectRole({
    onSuccess ({ dsid }, { tenantId, roleCode }) {
      const tenant = getTenant(tenantId)

      if (tenant) {
        const { departmentId, agentEmployeeId, roleType, agentBizType } =
          tenant
        // 确认选择需要执行的附加逻辑
        confirm({ dsid: dsid, agentEmployeeId, agentBizType })
        navigateTo(roleCode, roleType, departmentId, agentBizType)
      }
    },
  })

  const oneTenantNavigate = (tenant: Tenant) => {
    const {
      tenantId,
      roleList = [],
      roleType,
      agentBizType,
      departmentId,
    } = tenant
    if (roleList?.length === 1) {
      const { roleCode } = roleList[0]
      if (roleCode !== 'agentSeller' && roleCode !== 'agentSellerManager') {
        selectRoleMutate({ tenantId, roleCode })
      }
    }
    if (fromRef.current && roleList?.length > 1) {
      // agentBizType 110 150 是直营电小二
      if (agentBizType === 110 || agentBizType === 150) {
        // 从 目标看板/审批中心 角色跳转到首页需要自动切换角色
        const targetRole =
          from === 'namek'
            ? namekRules({ roleList })
            : autoRules({ roleList, roleType, departmentId })

        if (!targetRole) {
          fromRef.current = null
          return
        }
        const roleCode = roleList.find(o => o.roleCode === targetRole.role)?.roleCode
        if (roleCode) selectRoleMutate({ roleCode, tenantId })
      } else {
        // 代理商优先找代理商老板角色，没有的话取第一个
        const roleCode =
          roleList.find(role => role.roleCode === 'agencyBoss')?.roleCode ??
          roleList?.[0]?.roleCode
        if (roleCode && !FUWU_ROLES_LIST.includes(roleCode)) {
          selectRoleMutate({ roleCode, tenantId })
        }
      }
    }
  }

  const handleSubmit = async () => {
    selectRoleMutate({
      tenantId: form.getFieldValue('tenantId'),
      roleCode: form.getFieldValue('roleCode'),
    })
  }

  if (isLoading || !tenantList) {
    return (
      <div className="mt-5">
        <Loading />
      </div>
    )
  }
  if (!isLoading && tenantList.length === 0) {
    return (
      <div className="mt-20">
        <Empty
          type={EmptyType.NoPermission}
          text={
            <div>
              <p>暂无归属的公司，请联系您的HRBP或老板！</p>
              <p>可在添加权限后，刷新当前页面！</p>
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className="roles pb-12">
      <Form
        form={form}
        style={{
          '--border-top': 'none',
          '--border-inner': 'none',
          '--border-bottom': 'none',
        }}
      >
        <Dropdown ref={dropdownRef}>
          <Dropdown.Item
            key="sorter"
            className="bg-green-100 text-primary"
            title={
              <Form.Item className="picker" dependencies={['tenantId']} noStyle>
                {({ getFieldValue }) => {
                  const tenantName = getTenant(
                    getFieldValue('tenantId'),
                  )?.tenantName
                  return tenantName
                    ? `选择公司: ${tenantName}`
                    : '请选择归属公司'
                }}
              </Form.Item>
            }
          >
            <Form.Item name="tenantId" className="roles">
              <Radio.Group
                onChange={(value) => {
                  dropdownRef.current?.close()
                  bls.set('latestTenantId', value)
                  form.setFieldsValue({ roleCode: null })
                }}
              >
                <div className="picker pl-2 divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                  {tenantList.map(tenant => (
                    <div
                      key={tenant.tenantId}
                      className="p-2 pl-0 first:pt-0 last:pb-0"
                    >
                      <Radio
                        className="block text-gray-500"
                        value={tenant.tenantId}
                        disabled={tenant.status === 0}
                        style={{
                          '--font-size': '16px',
                        }}
                      >
                        {tenant.tenantName}
                        <span className="text-xs">
                          {tenant.status === 0 && '(已被禁用无法选择)'}
                        </span>
                      </Radio>
                    </div>
                  ))}
                </div>
              </Radio.Group>
            </Form.Item>
          </Dropdown.Item>
        </Dropdown>

        <div className="selectors">
          <Form.Item dependencies={['tenantId']} noStyle>
            {({ getFieldValue }) => {
              const tenantId = getFieldValue('tenantId')
              const roleList = getTenant(tenantId)?.roleList ?? []

              return (
                <>
                  {roleList.length > 0
                    ? (
                      <Form.Item name="roleCode">
                        <Radio.Group>
                          <div className="flex flex-row flex-wrap -mx-1.5">
                            {roleList.map(role => (
                              <div key={role.roleCode} className="p-1.5 w-1/2">
                                <Radio
                                  className="role flex w-full items-center h-14 p-2 pr-7 bg-gray-100 text-gray-600 rounded-lg"
                                  value={role.roleCode}
                                >
                                  {role.roleName}
                                  <CheckCircleFill className="checked" />
                                </Radio>
                              </div>
                            ))}
                          </div>
                        </Radio.Group>
                      </Form.Item>
                    )
                    : (
                      <div className="mt-20">
                        <Empty
                          type={tenantId ? EmptyType.NoData : undefined}
                          text={
                          tenantId
                            ? '暂无权限，请联系HRBP'
                            : '您的账号已被禁用，请联系HRBP或老板！'
                        }
                        />
                      </div>
                    )}
                  {roleList.length > 0 && (
                    <div className="fixed inset-x-0 bottom-0 p-2 bg-white shadow-sm">
                      <Button
                        color="primary"
                        block
                        size="large"
                        onClick={handleSubmit}
                      >
                        确定
                      </Button>
                    </div>
                  )}
                </>
              )
            }}
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default Roles
