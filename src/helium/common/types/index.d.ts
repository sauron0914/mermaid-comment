
declare global {
  interface Window {
    xdlog: any // 上报相关，TODO:更具体一点
  }
  type RequestError = {
    message?: string
    msg?: string
    code: number
    success: boolean
  }
}

export type LabelValueOption<T extends string | number> = {
  label: string
  value: T
}
