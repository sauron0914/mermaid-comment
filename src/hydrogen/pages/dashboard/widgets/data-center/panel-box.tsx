import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { dayjs } from '@dian/app-utils'
import queryString from 'query-string'
import { Modal } from 'antd-mobile'
import { IconSVG } from '@/common/components/icon-svg'
import { Panel, Segement, Quadrant, Switch } from './components'
import TopHeader from './organization/top-header'
import { fetchIndexDatas, fetchQuadrantReal } from './api'
import { useToastQuery } from '@dian/common/hooks/react-query'

const updateTime = () => {
  const now = dayjs()
  let m = now.minute()
  m = m - (m % 10)

  return now.format(`YYYY-MM-DD HH:${m === 0 ? '00' : m}:00`)
}

function Header ({ title, subtitle, extra = '' }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="text-lg font-bold leading-6">
        {title}
        {!!subtitle && <span className="text-xs text-gray-600 font-normal ml-2">{subtitle}</span>}
      </div>
      {!!extra && <div className="text-xs text-gray-600">{extra}</div>}
    </div>
  )
}

export function OverModelPanelBox ({ bizDate, tabs, userRole, overModelMap }) {
  const { userId, deptId, organization } = userRole

  const { data: quadrantRealData } = useToastQuery({
    queryKey: ['fetchQuadrantReal'],
    queryFn: () => fetchQuadrantReal({ deptId, userId, organization }),
  })

  const checkRole = TopHeader.useCheckRole(userRole)

  const onRealAnchor = (key, params) => {
    if (params?.targetURL) {
      checkRole(() => {
        location.href = params.targetURL
      })
    }
  }

  const children: any[] = []
  if (overModelMap.real) {
    const data = overModelMap.real

    const tab = {
      tabIndex: 0,
      tabName: data.tabList ? data.tabList[0] : '',
    }

    children.push(<Header key="real-header" title="实时" subtitle={`实时更新于：${updateTime()}`} />)
    children.push(<Panel
      key="real-panel"
      data={quadrantRealData || []}
      isReal
      isHide={data.isHide}
      hasAnchor
      onAnchor={onRealAnchor}
      modalName={data.name}
      tableName={data.tableName}
      tab={tab}
      tabs={tabs}
      userRole={userRole}
    />)
  }
  if (overModelMap.over) {
    const data = overModelMap.over

    const tab = {
      tabIndex: 0,
      tabName: data.tabList ? data.tabList[0] : '',
    }

    children.push(<Header
      key="over-header"
      title={data.name}
      subtitle={`当月数据更新于：${dayjs(bizDate).format('YYYY-MM-DD')}`}
    />)
    let panelData = []
    if (data.pointList && data.pointList[0] && data.pointList[0].itemList) {
      panelData = data.pointList[0].itemList
    }
    children.push(<Panel
      key="over-panel"
      data={panelData}
      isHide={data.isHide}
      hasAnchor
      modalName={data.name}
      tableName={data.tableName}
      tab={tab}
      tabs={tabs}
      userRole={userRole}
    />)
  }
  return <div className="p-2 bg-white rounded-md my-2 relative">{children}</div>
}

export default function PanelBox ({ data, bizDate, tabs, userRole, type, realModel }) {
  const {
    name,
    tableName,
    desp,
    tabList,
    pointList,
    isHide: hasHide,
    showType,
    help,
  } = data
  const { deptId, userId, organization } = userRole

  const indexDatas = useToastQuery({
    queryKey: ['fetchIndexDatas'],
    queryFn: () => fetchIndexDatas({
      dateType: '3', // crm首页应该只展示月度数据，没切换
      productId: 2,
      deptId,
      userId,
    }),
  })

  const { data: quadrantRealData } = useToastQuery({
    queryKey: ['fetchQuadrantReal'],
    queryFn: () => fetchQuadrantReal({ deptId, userId, organization }),
  })

  const [tabIndex, setTabIndex] = useState(0)
  const [quadrantIndex, setQuadrantIndex] = useState(1)

  const tab = useMemo(() => {
    return {
      tabIndex: tabIndex,
      tabName: tabList ? tabList[tabIndex] : '',
    }
  }, [tabIndex])

  function handleClickTab (index) {
    setTabIndex(index)
  }

  function handleSwitchBD (checked) {
    setQuadrantIndex(Number(!checked))
  }

  const onClickHelp = (event, title, desc) => {
    event.stopPropagation()
    Modal.alert({
      title,
      content: desc,
    })
  }

  const onRealAnchor = (key, params) => {
    params?.targetURL && (location.href = params.targetURL)
  }

  const onlyTabNameList = useMemo(() => {
    return tabList ? tabList.map(value => value.split(':')[0]) : []
  }, [tabList])

  const blockCards = useMemo(() => {
    // 判断是否是总览模块，目前没有一个字段能定位模块
    const isReal = tableName === 'dwp_crm_quadrant_m' && showType === null && realModel
    const children: any[] = []

    /**
     * 渲染头部
     */
    let title = name
    let subtitle, extra
    if (isReal) {
      title = '实时'
      subtitle = `实时更新于：${updateTime()}`
    }
    if (tableName === 'dwp_crm_manage_m' || tableName === 'dwp_target_business_district_stat_m') {
      subtitle = `当月数据更新于：${dayjs(bizDate).format('YYYY-MM-DD')}`
    }

    const { deptId, userId } = userRole
    const query = queryString.stringify({ deptId, userId, title })

    let columnCount
    // let otherContent = null

    if (type === 'asset') {
      columnCount = 3
      if (
        ['设备资产风控预警', '门店设备', '门店安装设备', '资产效率'].includes(name)
      ) {
        columnCount = 2
      }

      subtitle = `最后更新于：${dayjs(bizDate).format('YYYY-MM-DD')}`
      extra = (
        <a className="flex items-center justify-end text-base text-green-500" href={`/assets/personnel?${query}`}>
          查看明细
          <IconSVG symbol="icon-xianxing_you" className="w-[14px] h-[14px]" />
        </a>
      )
      if (help) {
        title = (
          <span onClick={e => onClickHelp(e, name, help)}>
            {title}&nbsp;
            <IconSVG symbol="icon-xianxing_bangzhu" className="w-[14px] h-[14px]" />
          </span>
        )
      }
    }

    switch (userRole.depLevel) {
      case 'BD':
        extra = null
        break
      case 'BDM':
      case 'CM':
        if (['仓库', '资产效率', '我的仓库'].includes(name)) {
          extra = null
        }
        break
      case 'LM':
      case 'DM':
      case 'CD':
        if (['设备资产风控预警', '资产效率'].includes(name)) {
          extra = null
        }
        break
      default:
        extra = null
    }

    // 象限渲染是否含BD开关
    if (showType === 3) {
      extra = (
        <span className="flex items-center">
          是否含BD新人 <Switch onClick={handleSwitchBD} fields={['是', '否']} />
        </span>
      )
    }

    children.push(<Header key={title} title={title} subtitle={subtitle} extra={extra} />)

    /**
     * 渲染tab选项卡
     */
    if (tabList && tabList.length) {
      children.push(<Segement
        key="sequment"
        data={onlyTabNameList}
        onClick={(e, i) => handleClickTab(i)}
        activeTab={tabIndex}
      />)
    }

    /**
     * 渲染内容
     */
    // 象限
    if (showType === 3) {
      children.push(<Quadrant
        key="quadrant"
        pointList={pointList[quadrantIndex] || []}
        desp={desp}
        userRole={userRole}
        tab={tab}
        tabs={tabs}
      />)

      return children
    }

    if (isReal) {
      // 总览->实时
      children.push(<Panel
        key="real-panel"
        data={quadrantRealData || []}
        isReal
        isHide={hasHide}
        hasAnchor
        onAnchor={onRealAnchor}
        modalName={name}
        tableName={tableName}
        tab={tab}
        tabs={tabs}
        userRole={userRole}
      />)
      // return children
      // 总览->总览
      children.push(<Header
        key="总览"
        title="总览"
        subtitle={`当月数据更新于：${dayjs(bizDate).format('YYYY-MM-DD')}`}
      />)
    }
    const indexData = indexDatas
    if (indexData) {
      const list = pointList.map((e) => {
        return (
          <Panel
            key={e.type}
            type={e.type}
            data={e.itemList}
            isManage={tableName === 'dwp_crm_manage_m'}
            isHide={hasHide}
            hasAnchor={type !== 'asset'}
            modalName={name}
            tableName={tableName}
            columnCount={columnCount}
            tab={tab}
            tabs={tabs}
            userRole={userRole}
            indexData={indexData}
          />
        )
      })
      children.push(...list)
    }

    return children
  }, [
    tableName,
    showType,
    name,
    tabList,
    pointList,
    bizDate,
    onlyTabNameList,
    tabIndex,
    desp,
    tab,
    tabs,
    quadrantRealData,
    hasHide,
    userRole,
    type,
    help,
    quadrantIndex,
    indexDatas,
    realModel,
  ])

  return (
    <div className="p-2 bg-white rounded-md my-2 relative">
      {!!desp && showType !== 3 /* 等于3时是象限模块，返回的是object */ && (
        <p className="text-xs text-gray-500 mb-2">{desp}</p>
      )}
      {blockCards}
    </div>
  )
}

PanelBox.propTypes = {
  data: PropTypes.shape({
    help: PropTypes.string,
    dataDate: PropTypes.string,
    moreAnalysisUrl: PropTypes.string,
    desp: PropTypes.any,
    tabList: PropTypes.array,
    pointList: PropTypes.pointList,
    isHide: PropTypes.number,
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  role: PropTypes.object,
  roleCode: PropTypes.string,
  query: PropTypes.object,
  tabs: PropTypes.array,
}
