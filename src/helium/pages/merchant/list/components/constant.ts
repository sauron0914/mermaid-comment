export const unableSignProfitsReason = ({ extData }) => {
  const { contractId, contractStatusName } = extData || {}
  return {
    HAS_PROFIT: `当前商户在${
      contractId > 10000000 ? '新系统' : '旧系统'
    }存在状态为：${contractStatusName}的合同，合同ID：${contractId}，如果需要开通合同，您可以进行如下操作：`,
  }
}

export const unableSignProfitsGuide = () => {
  return {
    KA_STOP_CONTRACT: [
      '联系您的运营，在合同到期后，走合同终止流程！',
      '确认合同终止后，您可以在这里开通合同。',
    ],
    // SHOP_REL: [
    //   '如果没有新建门店，您可以先新建门店，并从我的门店里点击签约开通合同',
    //   '如果已有门店，请去我的门店中找到门店，点击签约去开通合同；',
    // ],
    // ADD_AUTH:
    //   '点击待认证按钮，去给商户添加认证信息。添加认证信息时请仔细核实检查，保证添加的信息准确无误。',
  }
}
