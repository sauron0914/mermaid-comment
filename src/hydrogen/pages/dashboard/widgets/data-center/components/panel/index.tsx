import { useCallback, useMemo } from 'react'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import { dayjs } from '@dian/app-utils'
import { IndexCards } from '..'
import { href } from '@dian/app-utils/href'
import { formatRate } from '../../utils/format'
import TopHeader from '../../organization/top-header'

const { useCheckRole } = TopHeader
const colors = ['#6945FF', '#FF0808', '#FF5008', '#0763ED']

function Panel (props) {
  const {
    data,
    isHide,
    tab,
    type,
    isReal,
    isManage,
    hasAnchor,
    tabs,
    ...others
  } = props
  const { userId, deptId, deptName, depLevel } = others.userRole
  const role = depLevel?.toLowerCase()
  const { role: indexRole } = others.indexData && others.indexData[0] || {}
  const checkRole = useCheckRole(others.userRole)

  const dealMallsLocate = useCallback(() => {
    if (['cd', 'dm', 'lm'].includes(indexRole)) {
      return href('honor', '/malls/city-list')
    }
    if (indexRole === 'cm') {
      return href('honor', '/malls/malls-list?cityCode=0')
    }
  }, [indexRole])

  const onAnchor = useCallback((key, anchorParams) => {
    // @ts-ignore: 暂不处理
    window.xdlog?.log('khkbj9hl0m1tet', { title: key })
    if (others.onAnchor) {
      return others.onAnchor(key, anchorParams)
    }
    // 商圈模块
    if (others.tableName === 'dwp_target_business_district_stat_m') return dealMallsLocate()
    const { params = {}, ...requestArg } = anchorParams
    const bizDate = dayjs().subtract(1, 'days')
      .format('YYYYMMDD')
    if (isManage) {
      const arg = {
        role,
        bizDate,
        empId: userId,
        deptId,
      }
      params.forEach(({ key, value }) => {
        arg[key] = value
      })
      const qs = queryString.stringify({
        ...requestArg,
        nickName: `${deptName}-${type}-${requestArg.nickName}`,
        reportParams: JSON.stringify(arg),
        fixedColumn: 'shop_name',
      })
      checkRole(() => {
        location.href = `/merak/databoard/performance-report?${qs}`
      })
      return
    }

    if (role === 'bd' || role === 'ka') {
      // 门店
      const jumpTab = tabs.find(e => e.tabType === 4)
      if (!jumpTab) {
        return
      }
      const qs = queryString.stringify({
        ...requestArg,
        nickName: deptName,
        reportParams: JSON.stringify(params),
        fixedColumn: 'shop_name',
      })
      checkRole(() => {
        location.href = `/merak/databoard/performance-report?${qs}`
      })
      return
    }
    // 人员
    const jumpTab = tabs.find(e => e.tabType === 2)
    if (jumpTab) {
      if (anchorParams.params) {
        anchorParams.params = JSON.stringify(anchorParams.params)
      }
      const bizDate = dayjs().subtract(1, 'day')
        .format('YYYYMMDD')
      const urlQuery = {
        ...requestArg,
        params: JSON.stringify(params),
        tab: jumpTab.key,
        perTab: others.modalName,
        dateType: '3',
        bizDate,
        activeIndexs: [requestArg.asField],
      }
      if (others.modalName === '总览') {
        urlQuery.perTab = '象限(含新)'
      }
      params.labelIds && (urlQuery.labelList = params.labelIds)
      checkRole(() => {
        location.href = `/merak/app/decision/member-board?${queryString.stringify(urlQuery)}`
      })
    }
  }, [checkRole, dealMallsLocate, deptId, deptName, isManage, others, role, tabs, type, userId])

  const list = useMemo(() => {
    if (isReal) {
      return data
    }
    const list = data.filter((e, i) => {
      if (isManage && i === 0) {
        return false
      }
      return (
        (!isHide || !e.isHide) &&
        (tab.tabName === '充电宝' ? e.isPower : !e.isPower)
      )
    })

    return list.map((item) => {
      const {
        name,
        isHide,
        isRate,
        isHasRate,
        help,
        jump,
        asField,
        data,
      } = item

      let anchorParams: any = {}
      try {
        if (others.tableName === 'dwp_crm_quadrant_m') {
          if (role === 'bd' || role === 'ka') {
            anchorParams = JSON.parse(jump).bd
          }
        } else if (others.tableName === 'dwp_crm_manage_m') {
          anchorParams = JSON.parse(jump)
          const map = {}
          anchorParams.forEach(({ key, value }) => (map[key] = value))
          anchorParams = map
        }
      } catch (error) {}

      const option: any = {
        key: name,
        title: name,
        desc: help,
        isHide,
        anchor: hasAnchor && jump ? !!jump.trim() : false,
        anchorParams: {
          nickName: name,
          asField,
          ...anchorParams,
        },
      }

      if (data[tab.tabIndex]) {
        const { value, rate, yoy } = data[tab.tabIndex]
        let val = value
        if (isRate) {
          val = `${formatRate(val)}`
        }
        option.value = val
        if (isHasRate) {
          option.mom = rate
          option.yoy = yoy
        }
      }

      return option
    })
  }, [isReal, data, isManage, isHide, tab.tabName, tab.tabIndex, hasAnchor, others.tableName, role])

  const header = useMemo(() => {
    if (!isManage) {
      return null
    }

    if (!data || data.length === 0) {
      return null
    }
    const { name } = data[0]
    let value = 0
    let anchorParams
    if (data[0].data && data[0].data[0]) {
      const { asField, name, jump } = data[0]
      value = data[0].data[0].value
      if (jump) {
        const { code, params } = JSON.parse(jump)
        anchorParams = {
          asField,
          nickName: name,
          code,
          params,
        }
      }
    }

    return (
      <IndexCards.Header>
        <div className="flex justify-between">
          {type}
          <div
            className="text-xs"
            onClick={() => anchorParams && onAnchor(name, anchorParams)}
          >
            {name}
            &nbsp;
            <span
              className="ml-4 text-green-500"
              style={{ textDecoration: anchorParams && 'underline' }}
            >
              {value}
            </span>
          </div>
        </div>
      </IndexCards.Header>
    )
  }, [data, isManage, onAnchor, type])

  // 经营模块首个对象值为0时不展示
  if (isManage && data && data[0].data && data[0].data[0]) {
    const { value } = data[0].data[0]
    if (!value || value === '0' || value === '-') {
      return null
    }
  }
  let columnCount = isManage ? 4 : 2
  if (others.columnCount) {
    columnCount = others.columnCount
  }

  return (
    <div className="data-panel">
      <IndexCards
        collapsible={!!isHide}
        afterShrinkCount={6}
        mode={isManage ? 'simple' : undefined}
        columnCount={columnCount}
        colors={isManage ? colors : null}
        data={list}
        onAnchor={onAnchor}
      >
        {header}
      </IndexCards>
    </div>
  )
}

Panel.propTypes = {
  data: PropTypes.array,
  isHide: PropTypes.any,
  tab: PropTypes.object,
}

Panel.defaultProps = {
  data: [],
}

export default Panel
