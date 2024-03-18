import DataCenter from './data-center'
import { Today } from './today'
import { WorkOrder } from './work-order'
import { AccountBalance } from './account-balance'
import { MessageCenter } from './message-center'
import { Tools, CommonTools } from './tools'
import { AgentInfo } from './agent-info'

import type {
  PropsWithoutRef,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react'
import type { WidgetProps, WidgetRef } from '../types'

export const Widgets: Record<
  string,
  ForwardRefExoticComponent<PropsWithoutRef<WidgetProps> & RefAttributes<WidgetRef>>
> = {
  Today,
  WorkOrder,
  DataCenter,
  AccountBalance,
  MessageCenter,
  Tools,
  CommonTools,
  AgentInfo,
}
