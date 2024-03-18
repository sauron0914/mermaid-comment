import type { ReactNode } from 'react'
import type { Dayjs } from 'dayjs'
export enum DateTypeEnum {
  Day = '1',
  Week = '2',
  Month = '3',
}

export enum TModeEnum {
  T0 = 'T0',
  T1 = 'T1',
}

export interface MulDatePickerProp {
  value?: Date
  defaultValue?: Date
  type?: DateTypeEnum
  defaultType?: DateTypeEnum
  minDate?: Date
  maxDate?: Date
  mode?: TModeEnum
  performanceWeek?: boolean
  onlyMonth?: boolean
  extra?: ReactNode
  onChange?: (type: DateTypeEnum, value: Date) => void
  dateTypeSelectInPicker?: boolean
}

export interface T1PickerProp {
  value: Dayjs
  type: DateTypeEnum
  minDate?: Dayjs
  maxDate?: Dayjs
  performanceWeek: boolean
  onlyMonth?: boolean
  extra?: ReactNode
  onChange: (type: DateTypeEnum, value: Dayjs) => void
  dateTypeSelectInPicker?: boolean
}
