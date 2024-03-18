import { createApi } from '@dian/app-utils'
import { env } from '@/common/env'

export const EmilyApi = createApi({ baseURL: `${env.HOST}/emily` })
export const DcApi = createApi({ baseURL: `${env.DC_HOST}` })

export const fetchConfig = (payload) => {
  return DcApi.post('/emily-crm/emily/board/crm/getConfigByAs', payload)
}

export const fetchQuadrantReal = async ({ userId, deptId, organization }) => {
  const config = await DcApi.post('/deus-ex-machina/query/v2/fetchReportInfo', { reportCode: 'realSurvey-CRM', userId, deptId })
  const resList = await Promise.all([
    DcApi.post('/deus-ex-machina/query/v2/fetchData', { reportCode: 'realSurvey-CRM', userId, deptId }),
    DcApi.post('/deus-ex-machina/query/v2/fetchData', { reportCode: 'realShopTop-CRM', userId, deptId, params: { organization } }),
  ])
  const realDataMap = {}
  // 不知道什么原因导致map key顺序被排序，怀疑是chrome版本导致的
  const keysSequenceList: string[] = []
  resList.forEach((item) => {
    const { columns, rows } = item
    columns.forEach(({ name, label, desc }) => {
      if (/(mom|yoy)$/.test(name)) {
        return
      }
      keysSequenceList.push(name)
      realDataMap[name] = { key: name, title: label, desc }
    })
    if (rows.length > 0) {
      const data = rows[0]
      Object.keys(data).forEach((key) => {
        const theKey = key.replace(/_(mom|yoy)$/, '')
        if (/mom$/.test(key)) {
          realDataMap[theKey].mom = data[key]
        } else if (/yoy$/.test(key)) {
          realDataMap[theKey].yoy = data[key]
        } else {
          realDataMap[key].value = data[key]
        }
      })
    }
  })
  const list = keysSequenceList.map(key => realDataMap[key])

  if (config?.anchor) {
    const anchorMap = {}
    config.anchor.forEach((item) => {
      anchorMap[item.fromParam] = item
    })
    list.forEach((item) => {
      const anchor = anchorMap[item.key]
      if (anchor) {
        item.anchor = true
        item.anchorParams = anchor
      }
    })
  }
  return list
}

export const fetchIndexDatas = (payload) => {
  return DcApi.post('/emily-crm/emily/board/crm/index', payload)
}
