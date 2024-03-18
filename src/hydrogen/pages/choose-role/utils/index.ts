import {
  CEO_DEPARTMENT,
  PERMISSION,
  PERMISSION_NAME,
  ROLES,
  ROLES_NAME,
} from './constants'
import { env } from '@/common/env'
import { GlobalContainer } from '@/common/store'
import {
  bls,
  removeAssetUnitsPermission,
  removeBindDeviceInfo,
  setAssetUnitsPermission,
  setGrayTagList,
  setIsHonor,
  setIsVentureCompany,
} from '@/common/utils/storage'
import { setAgentRole, setSellerRole } from '@/common/utils/user'
import { getWatermark } from '@/common/utils/watermark'
import { setUser } from '@dian/bridge'

export const getRoleLink = (role, departmentId, from, isAgent) => {
  switch (role) {
    case 'warehouseKeeper': // 销售支持
    case 'centralWarehouseKeeper': // 中心仓管
    case 'mcm': // mcm
    case 'maintenance': // mc
    case 'OutWorkerMC': // 外包MC
    case 'businessOC': // 商务运维总监
    case 'kaDirector': // 大客户总监
    case 'KAManager':
    case 'agentSeller': // bd
    case 'agentSellerManager': // bdm
    case 'maintenanceWorker': // 高管检修员(默认进入新BD主页)
    case 'xiaodian_yunying': // 小电运营
    case 'youdian_yunying': // 友电运营
    case 'yidianyuan_yunying': // 伊电园运营
    case 'channelManager': // 渠道经理
    case 'channelOperate': //  渠道运营
    case 'channel_chief': // 渠道总监
    case 'channelOperateManager': // 渠道运营经理
    case 'channelAreaChief':
    case 'op_agent_bd': // 运营服务商员工
    case 'op_agent_boss': // 运营服务商老板
    case 'opAgentWarehouseKeeper': // 运营服务商仓管
    case 'agencyBoss': // 代理商老板
    case 'agencyBD': // 代理商员工
    case 'AGENCY_BDM': // 代理商BDM
    case 'agencyCooperativePartner': // 代理商合伙人
    case 'xdstation_BD':
      if (
        (role === 'kaDirector' || role === 'agentSellerManager') &&
        departmentId === CEO_DEPARTMENT &&
        from === 'auto'
      ) {
        return {
          app: 'merak',
          to: '/',
        }
      }
      return {
        app: 'hydrogen',
        to: '/dashboard',
      }
    case 'ceo': // ceo
      return {
        app: 'honor',
        to: '/home?isNew=1',
      }
    case 'approveCenter': // 审批中心
      return {
        app: 'indra',
        to: `${env.O_HOST}/approvalCenter/center`,
      }
    case 'targetWatch': // 目标看板
      return {
        app: 'merak',
        to: '/',
      }
    default:
      // 代理商角色都会去首页
      if (isAgent) {
        return {
          app: 'hydrogen',
          to: '/dashboard',
        }
      }
      return {
        app: 'hydrogen',
        to: '/scan-login',
      }
  }
}

// 规则prd: http://confluence.dian.so/pages/viewpage.action?pageId=30575448
export const autoRules = ({ roleList, roleType, departmentId }) => {
  const role = [
    {
      rule:
        departmentId === CEO_DEPARTMENT &&
        roleList.some(o => o.roleId === PERMISSION[PERMISSION_NAME.BDM]),
      role: PERMISSION_NAME.BDM,
    },
    {
      rule:
        departmentId === CEO_DEPARTMENT &&
        roleList.some(
          o => o.roleId === PERMISSION[PERMISSION_NAME.TARGETWATCH],
        ),
      role: PERMISSION_NAME.TARGETWATCH,
    },
    {
      rule:
        roleType === ROLES[ROLES_NAME.BD] &&
        roleList.some(o => o.roleId === PERMISSION[PERMISSION_NAME.BD]),
      role: PERMISSION_NAME.BD,
    },
    {
      rule:
        [
          ROLES[ROLES_NAME.BDM],
          ROLES[ROLES_NAME.CM],
          ROLES[ROLES_NAME.LM],
          ROLES[ROLES_NAME.DM],
        ].includes(roleType) &&
        roleList.some(o => o.roleId === PERMISSION[PERMISSION_NAME.BDM]),
      role: PERMISSION_NAME.BDM,
    },
  ].find(({ rule }) => rule === true)
  return role ?? null
}

// http://confluence.dian.so/pages/viewpage.action?pageId=41259786
export const namekRules = ({ roleList }) => {
  const role = [
    {
      rule: roleList.some(
        role => role.roleId === PERMISSION[PERMISSION_NAME.BDM],
      ),
      role: PERMISSION_NAME.BDM,
    },
    {
      rule: roleList.some(
        role => role.roleId === PERMISSION[PERMISSION_NAME.BD],
      ),
      role: PERMISSION_NAME.BD,
    },
    {
      rule: roleList.some(
        role => role.roleId === PERMISSION[PERMISSION_NAME.KAM],
      ),
      role: PERMISSION_NAME.KAM,
    },
    {
      rule: roleList.some(
        role => role.roleId === PERMISSION[PERMISSION_NAME.KA],
      ),
      role: PERMISSION_NAME.KA,
    },
  ].find(({ rule }) => rule === true)
  return role ?? null
}

export function useRoleConfirmEffect () {
  const container = GlobalContainer.useContainer()

  const confirm = ({ dsid, agentEmployeeId, agentBizType }) => {
    const isHonor = agentBizType === 110 || agentBizType === 150 // 是电小二
    const mobile = bls.get('mobile')

    setIsHonor(isHonor)
    removeBindDeviceInfo()
    if (isHonor) {
      setSellerRole()
      setAssetUnitsPermission({ isNew: true })
      // 是否合资公司
      setIsVentureCompany(agentBizType === 150)
      setSellerRole()
      setGrayTagList()
      // 防止高管检修员退出登录后直接使用原生扫码进入设备详情页丢失当前session
      setAssetUnitsPermission({ isNew: true })
    } else {
      setAgentRole()
      removeAssetUnitsPermission()
    }

    // 传给客户端数据
    setUser({
      token: dsid,
      userId: agentEmployeeId,
      phone: mobile,
    })
    // 水印数据
    container.setWatermark(getWatermark())
  }

  return { confirm }
}
