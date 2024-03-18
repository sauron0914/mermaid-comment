import { setErrorMap, ZodIssueCode, ZodParsedType } from 'zod'
import type { ZodErrorMap } from 'zod'

export const messageMap = {
  required: '必填',
}

const customErrorMap: ZodErrorMap = (issue, ctx) => {
  let message = ''

  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = messageMap.required
      }
      break

    default:
      message = ctx.defaultError
      break
  }

  return { message }
}

export function initZod () {
  setErrorMap(customErrorMap)
}
