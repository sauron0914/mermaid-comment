// 选择角色页的 自动跳转规则
export const CEO_DEPARTMENT = 516 // 部门为CEO办公室

export const ROLES_NAME = {
  BD: 'BD',
  BDM: 'BDM',
  CM: 'CM',
  LM: 'LM',
  DM: 'DM',
  KAM: 'KAM',
  KA: 'KA',
}

export const ROLES = {
  [ROLES_NAME.BD]: 1,
  [ROLES_NAME.BDM]: 2,
  [ROLES_NAME.CM]: 3,
  [ROLES_NAME.LM]: 30,
  [ROLES_NAME.DM]: 6,
  [ROLES_NAME.KAM]: 33,
  [ROLES_NAME.KA]: 33,
}

export const PERMISSION_NAME = {
  BD: 'agentSeller',
  BDM: 'agentSellerManager',
  TARGETWATCH: 'targetWatch',
  KAM: 'kaDirector',
  KA: 'KAManager',
  MW: 'maintenanceWorker',
  XDO: 'xiaodian_yunying', // 小电运营
  YDO: 'youdian_yunying', // 友电运营
  YDYO: 'yidianyuan_yunying', // 伊甸园运营
}

export const PERMISSION = {
  [PERMISSION_NAME.BD]: 1,
  [PERMISSION_NAME.BDM]: 7,
  [PERMISSION_NAME.TARGETWATCH]: 114,
  [PERMISSION_NAME.KAM]: 99,
  [PERMISSION_NAME.KA]: 51,
}

// 电小代角色
export const FUWU_ROLES_LIST = [
  'op_agent_bd',
  'op_agent_boss',
  'opAgentWarehouseKeeper',
]
