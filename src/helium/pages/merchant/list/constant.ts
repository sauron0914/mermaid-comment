import { isHonor } from '@/common/utils/env'

// 商户 status
export const MERCHANTS_STATUS = [
  {
    label: '全部',
    value: -1,
    default: true,
    visible: true,
  },
  {
    label: '待签约',
    value: 1,
    visible: !isHonor, // 代理商可见该筛选
  },
  {
    label: '待安装',
    value: 0,
    visible: true,
  },
  {
    label: '已安装',
    value: 4,
    visible: true,
  },
  {
    label: '已回收',
    value: 6,
    visible: true,
  },
].filter(item => item.visible)

// 排序 --> 下面顺序不要随便修改
export const SORT_LIST = [
  {
    label: '离我最近',
    value: 0,
    default: true,
    visible: true,
  },
  {
    label: '智能排序',
    value: -1,
    visible: true,
  },
  {
    label: '商户创建时间降序',
    value: 4,
    visible: true,
  },
  {
    label: '商户安装时间降序',
    value: 1,
    visible: true,
  },
  {
    label: '商户等级降序',
    value: 2,
    visible: true,
  },
  {
    label: '合同到期时间降序',
    value: 3,
    visible: isHonor, // 代理商不可见该筛选
  },

].filter(item => item.visible)

// 商户标签背景颜色
export const MERCHANT_LABEL_TAG_BG = {
  5: '#F10505',
  8: '#FFF4E6',
}

// 商户标签文本颜色
export const MERCHANT_LABEL_TAG_COLOR = {
  5: '#fff',
  8: '#F56A07',
}

// 商户状态标签背景颜色
export const MERCHANT_STATUS_TAG_BG = {
  4: '#E6FFEE',
  6: '#F5F5F5',
}

// 商户状态标签文本颜色
export const MERCHANT_STATUS_TAG_COLOR = {
  4: '#00AF50',
  6: '#585858',
}
