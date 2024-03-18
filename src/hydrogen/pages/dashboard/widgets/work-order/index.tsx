import { forwardRef, useImperativeHandle, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Modal } from 'antd-mobile'
import { getLoginRole } from '@dian/app-utils/bridge'
import { fetchWorkOrderData } from './api'

import { dayjs } from '@dian/app-utils'
import { useRouter } from '@dian/app-utils/router'
import { MiniTabs } from '@/common/components/mini-tabs'
import { IconSVG } from '@/common/components/icon-svg'
import { MulDatePicker } from '@/common/components/mul-date-picker'
import TopHeader from '@/pages/dashboard/widgets/data-center/organization/top-header'
import {
  CalType,
  DateTypeEnum,
  IndexTypeMap,
  TModeEnum,
  TeamCalTypes,
  workOrderConfig,
} from './constants'
import { getStartDate } from './utils'
import type { WidgetProps, WidgetRef } from '../../types'

const { useCheckRole } = TopHeader

const IndicatorCards = ({ cards }) => {
  const { navigator } = useRouter()
  const onTips = (e, item) => {
    e.stopPropagation()

    const desc = item?.desc?.split(';').map((item, index) => (
      <span key={item}>{`${index + 1},${item}`}<br /></span>
    ))

    Modal.confirm({
      title: item.label,
      content: desc,
      cancelText: '我知道了',
      confirmText: '我有异议',
      onConfirm () {
        navigator.href('honor', '/user/feedback')
      },
    })
  }
  return (
    <div className="flex flex-wrap justify-between">
      {
        cards.list.map((item, index) => (
          <span
            className={`flex flex-col items-center text-xs w/[1${cards.cols}]`}
            key={index}
          >
            <span className="flex items-center mb-2 text-[#585858] break-keep">
              <span>{item.label}</span>
              {item.desc && (
                <IconSVG
                  className="ml-0.5"
                  size={16}
                  symbol="icon-xianxing_bangzhu"
                  onClick={e => onTips(e, item)}
                />
              )}
            </span>
            <span className="text-base text-center">{item.value}</span>
          </span>
        ))
      }
    </div>
  )
}

export const WorkOrder = forwardRef<WidgetRef, WidgetProps>(function WorkOrder (props, ref) {
  const userOrganization: any = props.userOrganization ?? {}
  const { organization, deptLevel, userId } = userOrganization
  const checkRole = useCheckRole(userOrganization)
  const { navigator } = useRouter()

  const isBD = getLoginRole() === 'agentSeller'

  const [searchParams, setSearchParams] = useState({
    code: 'workOrderSummary',
    param: {
      endDate: dayjs(new Date()).format('YYYYMMDD'),
      statType: CalType.Total,
      roleType: deptLevel?.toLocaleLowerCase(),
      reqUserId: userId,
      channelType: organization || (deptLevel?.toLocaleLowerCase() === 'ceo' && 'ALL'),
      startDate: dayjs(new Date()).format('YYYYMMDD'),
      dateType: DateTypeEnum.Day,
    },
  })

  const { data = {}, isLoading, refetch } = useQuery({
    queryKey: ['fetchWorkOrderData', searchParams],
    queryFn () {
      return fetchWorkOrderData(searchParams)
    },
  })

  const onCaltypeChange = ({ key: statType }) => {
    setSearchParams({
      ...searchParams,
      param: {
        ...searchParams.param,
        statType,
      },
    })
  }

  const onDatePickerChange = (type: DateTypeEnum, value: Date) => {
    setSearchParams(e => ({
      ...e,
      param: {
        ...e.param,
        startDate: getStartDate(type, value),
        endDate: dayjs(value).format('YYYYMMDD'),
        dateType: type,
      },
    }))
  }

  // 转换工单数据
  const formatIndicatorData = (indicator) => {
    const { indexList } = indicator
    const { dateType, endDate, startDate } = searchParams.param

    // 指标跳转逻辑
    const indicatorHref = (billType, label) => {
      window.xdlog?.log('kojug0v668lgn0', {
        type: 'work-order',
        name: label,
        userName: userOrganization.nickName,
        role: userOrganization.roleName,
      })

      if (isBD) {
        const { userId, deptId } = userOrganization
        checkRole(() => {
          navigator.href('honor', `/workorder-center/list?targetUserId=${userId}&assigneeDept2=${deptId}&workorderCenterList={"workOrderType":[${billType}]}`)
        })

        return
      }
      if (billType) {
        const workOrderCenterDashboard = {
          startDate,
          dateType,
          endDate,
          currentOrderTypeList: [+billType],
        }
        checkRole(() => {
          navigator.href('honor', `/configHome/workorder-center/dashboard?workOrderCenterDashboard=${JSON.stringify(workOrderCenterDashboard)}`)
        })
      }
    }
    // 百分占比格式化
    const percentage = (molecular, denominator) => (denominator ? `(${((molecular / denominator) * 100).toFixed(0)}%)` : null)
    return {
      list: indexList.map((indexCode: {title: string, key: string, desc: string}) => {
        const label = indexCode.title || IndexTypeMap[indexCode?.key]?.title
        const done = data?.[IndexTypeMap[indexCode?.key]?.doneKey]
        const all = data?.[IndexTypeMap[indexCode?.key]?.allKey]
        const billType = IndexTypeMap[indexCode?.key]?.billType
        return (
          {
            label,
            desc: indexCode.desc,
            value: (<>
              <span className="flex items-center space-x-1 cursor-pointer text-sm" onClick={() => indicatorHref(billType, label)}>
                <span className="text-primary ">
                  {done || 0}
                </span> /{all || 0}
                <IconSVG className="text-[#999999]" size={12} symbol="icon-xianxing_you" />
              </span>
              <span className="text-xs font-normal text-[#999999] mt-1">{percentage(done, all)}</span>
            </>),
          }
        )
      }),
      cols: data && Object.values(data).some(item => (item as number) > 100000) ? 2 : 3,
    }
  }

  const fetchData = async () => {
    await refetch()
  }

  useImperativeHandle(ref, () => ({ fetchData }))

  return (
    <div className="bg-text rounded-lg overflow-hidden">
      <MulDatePicker
        onChange={onDatePickerChange}
        mode={TModeEnum.T0}
        performanceWeek
      />
      <Card
        className="rounded-none"
        title={`${!isBD ? '团队' : ''}工单`}
        headerClassName="pb-0"
        bodyClassName="space-y-2.5"
        extra={
          !isBD && (
            <MiniTabs
              options={TeamCalTypes.map(({
                label,
                value,
              }) => ({
                title: label,
                key: value,
              }))}
              onChange={onCaltypeChange}
            />
          )
        }
      >
        {
          isLoading
            ? <>
              <div className="animate-pulse h-28 bg-gray-200 rounded" />
              <div className="animate-pulse h-28 bg-gray-200 rounded" />
            </>
            : workOrderConfig.map(item => (
              <Card
                className="border border-solid border-[#F2F2F2] rounded-lg shadow-md"
                key={item.title}
                title={
                  <>
                    <IconSVG size={18} symbol={item.icon || 'icon-fangshouicon'} />
                    <span className="ml-1 text-sm">{item.title}</span>
                  </>
              }
                extra={<span className="text-[#585858]">{item.subTitle}</span>}
              >
                <IndicatorCards cards={formatIndicatorData(item)} />
              </Card>
            ))
         }
      </Card>
    </div>
  )
})
