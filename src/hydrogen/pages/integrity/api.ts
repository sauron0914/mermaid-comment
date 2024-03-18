import { zApi } from '@dian/app-utils'

interface IntegrityReportsCreateParams {
  complaintContent: string
  complaintEmail?: string
  complaintMobile: string
  complaintName?: string
  fileUrls?: string[]
  originType: 3
  reportedPerson: string
}
// 创建一条举报记录
export const createIntegrityRecord = (params: IntegrityReportsCreateParams) => {
  return zApi.post('/nile/api/v1/integrity/reports', params)
}
