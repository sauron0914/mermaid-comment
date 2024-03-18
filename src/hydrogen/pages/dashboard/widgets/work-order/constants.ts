export enum CalType {
  Total = 0,
  PerCapita = 1,
}

export enum TModeEnum {
  T0 = 'T0',
  T1 = 'T1'
}

export enum DateTypeEnum {
  Day = '1',
  Week = '2',
  Month = '3'
}

export const TeamCalTypes = [
  {
    label: '总计',
    value: CalType.Total,
  },
  {
    label: '人均',
    value: CalType.PerCapita,
  },
]

export const workOrderConfig = [{
  title: '防守',
  subTitle: '※关注日清、周清工单',
  icon: 'icon-fangshouicon',
  indexList: [{
    title: '订单骤降',
    key: 'dive',
    desc: '工单逻辑：连续两日订单流水较前四周同期次峰值下降超过一定比例（L4降50%及以上，L5降30%及以上，L6-L7降20%及以上，L8降10%及以上）;处理建议：上门排查，视情况清竞对、优化点位、解决设备故障等问题。',
  }, {
    title: '预警测算',
    key: 'earlyWarn',
    desc: '工单逻辑：L4及以上纯分成合同门店的分成比例小于70%;处理建议：与商户签约高分成、分成预付或进场费合同。',
  }, {
    title: '亏损预警',
    key: 'lossCalculate',
    desc: '工单逻辑：L3及以上无合同的门店;处理建议：与商户签订合同。',
  }],
}, {
  title: '运维',
  icon: 'icon-yunweiicon',
  subTitle: '※关注门店离线缺宝问题',
  indexList: [{
    title: '门店离线(日清)',
    key: 'head',
    desc: '工单逻辑：门店营业时间内，设备离线超1小时;处理建议：上门处理或电话联系商家恢复在线。',
  }, {
    title: '补宝(日清)',
    key: 'fill',
    desc: '工单逻辑：设备充电宝数小于目标充电宝数（目标充电宝数取决于近一周的设备订单率和设备类型）;处理建议：及时补宝。',
  }, {
    title: '充电宝回收',
    key: 'recycling',
  }],
}]

export const IndexTypeMap = {
  zeroRate: {
    title: '0分成门店优化',
    allKey: 'zeroRateAll',
    doneKey: 'zeroRateDone',
    billType: '9',
  },
  dive: {
    title: '订单骤降',
    allKey: 'diveAll',
    doneKey: 'diveDone',
    billType: '6',
  },
  L4: {
    title: 'L4+门店',
    allKey: 'L4All',
    doneKey: 'L4Done',
    billType: '7',
  },
  installRate: {
    title: '门店安装',
    allKey: 'installAll',
    doneKey: 'installDone',
    billType: '61',
  },
  recycling: {
    title: '充电宝回收',
    allKey: 'recyclingAll',
    doneKey: 'recyclingDone',
    billType: '83',
  },
  zeroProduce: {
    title: '0产单门店',
    allKey: 'zeroProduceAll',
    doneKey: 'zeroProduceDone',
  },
  fill: {
    title: '补宝',
    allKey: 'fillAll',
    doneKey: 'fillDone',
    billType: '85',
  },
  head: {
    title: '头部门店离线',
    allKey: 'offlineAll',
    doneKey: 'offlineDone',
    billType: '86',
  },
  L3: {
    title: 'L3及以上0分成工单',
    allKey: 'L3zeroAll',
    doneKey: 'L3zeroDone',
    billType: '8',
  },
  earlyWarn: {
    title: '预警测算工单',
    allKey: 'earlyWarnAll',
    doneKey: 'earlyWarnDone',
    billType: '133',
  },
  loss: {
    title: '亏损测算工单',
    allKey: 'lossAll',
    doneKey: 'lossDone',
    billType: '134',
  },
  lossCalculate: {
    title: '亏损预警工单',
    allKey: 'lossCalculateAll',
    doneKey: 'lossCalculateDone',
    billType: '129',
  },
}
