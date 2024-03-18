export const unbaleDelContractReason = ({ extData }) => {
  const { contractId, contractStatusName, makeStatusName, makeId } =
    extData || {}
  return {
    OTHER: '其他原因',
    HAS_PROFIT_CONTRACT: `当前认证信息已经绑定了状态为${contractStatusName}的分成合同（合同ID：${contractId}），如果想要删除此认证信息，您可以进行如下操作：`,
    HAS_CONTRACT_MAKE: `当前认证信息已经绑定了状态为${makeStatusName}的合同拟定（合同拟定ID：${makeId}），如果想要删除此认证信息，您可以进行如下操作：`,
    HAS_SLOTTING_CONTRACT: `当前认证信息已经绑定了状态为${contractStatusName}的进场费合同（合同ID：${contractId}），如果想要删除此认证信息，您可以进行如下操作：`,
    HAS_WITH_DRAW: '有提现中申请，不能删除认证',
    HAS_AUDITING_PROCESS: '存在流程中的认证，如需删除认证，需先撤回',
  }
}

export const unbaleDelContractGuide = ({ extData }) => {
  const { makeManagerName } = extData || {}
  return {
    CONTACT_PM: '联系总部产品经理进行解决',
    STOP_NORMAL_PROFIT_CONTRACT: [
      '去我的合同里找到这份合同并发起解约流程，解约合同后，合同状态为已解约;如果是电子签，解约流程需要商户同意才会结束；\n如果合同商户尚未签约，则不用发起终止流程，请在我的合同里撤回合同；',
      '再回来这里删除需要删除的认证信息；',
      '重新添加正确的认证信息；',
    ],
    STOP_CONTRACT: [
      '去我的合同里找到这份合同并发起解约流程，解约合同后，合同状态为已解约；如果是电子签，解约流程需要商户同意才会结束；',
      '再回来这里删除需要删除的认证信息；',
      '重新添加正确的认证信息；',
    ],
    STOP_CONTRACT_MAKE: [
      `联系${makeManagerName}去PC端拟定管理（新）里找到这份合同拟定并作废；`,
      '合同拟定作废后，再回来这里删除需要删除的认证信息；',
      '重新添加正确的认证信息；',
    ],
    BD_CONTACT_CM_STOP: [
      '联系您的cm，走进场费的合同终止流程；',
      '在合同完成终止后，再回来这里删除需要删除的认证信息；',
      '重新添加正确的认证信息；',
    ],
    KA_CONTACT_O_STOP: [
      '联系您的运营，走进场费的合同终止流程；',
      '在合同完成终止后，再回来这里删除需要删除的认证信息；',
      '重新添加正确的认证信息；',
    ],
  }
}
