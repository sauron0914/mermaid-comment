export const unableClaimReason = {
  HAS_NO_MANAGER: '该商户无商户负责人，可直接认领',
  HAS_OTHER_SHOP: '当前商户无负责人，但是关联了别人的门店',
  MANAGER_IS_QUIT: '该商户负责人已离职，可直接认领',
  HAS_VALID_CONTRACT: '当前拥有生效中的合同',
  BD_IS_NOT_CLAIM_KA: '当前商户已有KA负责人，无法申请认领',
  MANAGER_IS_OWN: '当前商户已存在，且商户负责人是自己',
  MERCHANT_IS_CLAIMING: '当前商户正在认领中',
  MERCHANT_IS_NOT_BD_OR_KA: '商户负责人不是直营、KA部门，不允许认领',
  APPLICANT_IS_NOT_BD_OR_KA: '申请人不是直营、KA部门，不允许认领',
  APPLICANT_IS_LEADER_OF_MANAGER: ' 申请人是商户负责人的上级，可直接认领',
  APPLY_CLAIM_ACCOUNT:
    '当前商户已存在，且已有商户负责人，不得重复创建，需申请认领',
  MANAGER_HAS_OTHER_SHOP: '该商户有门店负责人，不支持认领',
  OTHER: '其他原因',
  HAS_MANAGER: '当前商户已有负责人',
}

export const unableClaimGuide = {
  BD_CONTACT_BDM: '联系您的BD主管将此商户分配给您！',
  BD_CONTACT_CM: '联系您的城市经理将此商户分配给您！',
  BD_CONTACT_DM: '联系您的省区经理将此商户分配给您！',
  BD_CONTACT_DO: '联系您的大区运营将此商户分配给您！',
  KA_CONTACT_O: '联系大区运营分配给您',
  CONTACT_PM: '联系运营进行商户分配',
  CONTACT_CHANNEL_MANAGER: '联系渠道经理进行解决',
}

export const MERCHANT_TIP_TEXT = {
  MANAGER_IS_OWN: 'text-[#0FB269]',
  APPLICANT_IS_LEADER_OF_MANAGER: 'text-[#F56A07]',
}

export const MERCHANT_TIP_BG = {
  MANAGER_IS_OWN: 'bg-[#DAF2E1]',
  APPLICANT_IS_LEADER_OF_MANAGER: 'bg-[#FFF4E6]',
}
