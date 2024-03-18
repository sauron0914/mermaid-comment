import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd-mobile'
import { IconSVG } from '@/common/components/icon-svg'
import { Result } from './components'
import PanelBox, { OverModelPanelBox } from './panel-box'

import shopImg from './assets/shop.png'
import warehouseImg from './assets/warehouse.png'
import { formatAmount } from './utils/format'

const imgList = [warehouseImg, shopImg]

export default function PanelList ({ data: indexData, tabs, userRole, type = '' }) {
  const children = useMemo(() => {
    const { data, error, query } = indexData

    if (error) {
      return <Result type="error" msg={error.message} />
    }

    if (!data) {
      return null
    }

    if (!userRole) {
      return null
    }

    if (!data.length || !data[0].modelList || !data[0].modelList.length) {
      return <Result type="error" msg="目标看板数据为空" />
    }
    const filterTableList = ['城市仓数量', '门店数量']
    const { bizDate } = data[0]

    const cardModelList = data[0].modelList.filter((item) => {
      return filterTableList.includes(item.name)
    })

    const realModelId = 12348
    const overModelId = 12351
    let modelList = data[0].modelList
    if (['CD', 'DM', 'LM'].includes(userRole.depLevel) && type === 'asset') {
      modelList = modelList.filter((item) => {
        return !filterTableList.includes(item.name)
      })
    }
    const realModel = modelList.find(item => item.id === realModelId)
    const overModel = modelList.find(item => item.id === overModelId)
    const overModelMap = {}
    if (realModel) {
      overModelMap.real = realModel
      modelList = modelList.filter(item => item.id !== realModelId)
    }
    if (overModel) {
      overModelMap.over = overModel
      modelList = modelList.filter(item => item.id !== overModelId)
    }

    const cards = cardModelList.length > 0 ? <Cards data={cardModelList} /> : null

    return (
      <div>
        {cards}
        <OverModelPanelBox
          bizDate={bizDate}
          query={query}
          tabs={tabs}
          userRole={userRole}
          overModelMap={overModelMap}
        />
        {modelList.map((e) => {
          return (
            <PanelBox
              key={e.id}
              data={e}
              bizDate={bizDate}
              query={query}
              tabs={tabs}
              userRole={userRole}
              type={type}
              realModel={realModel}
            />
          )
        })}
      </div>
    )
  }, [indexData, userRole, type, tabs])

  return <div>{children}</div>
}

PanelList.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.any,
    error: PropTypes.any,
    loading: PropTypes.any,
    query: PropTypes.any,
  }),
  role: PropTypes.object,
  tabs: PropTypes.array,
}

PanelList.defaultProps = {
  data: {},
}

function Cards (props) {
  const { data } = props

  const onClickHelp = (event, title, desc) => {
    event.stopPropagation()
    Modal.alert({
      title,
      content: desc,
    })
  }

  const children = useMemo(() => {
    const list = data.map((item, i) => {
      const { id, name, help, pointList } = item
      let value = ''
      if (
        pointList &&
        pointList[0] &&
        pointList[0].itemList &&
        pointList[0].itemList[0] &&
        pointList[0].itemList[0].data &&
        pointList[0].itemList[0].data[0]
      ) {
        value = pointList[0].itemList[0].data[0].value
      }

      return (
        <div key={id} className="flex-1 rounded-lg bg-white p-2 mr-2 relative overflow-hidden">
          <div className="text-xs transform-origin-left break-all leading-6 text-gray-700">
            <span onClick={e => onClickHelp(e, name, help)}>
              {name}&nbsp;
              <IconSVG symbol="icon-xianxing_bangzhu" className="w-[14px] h-[14px]" />
            </span>
          </div>
          <div className="flex items-center text-base py-2 font-semibold text-gray-700 align-bottom flex-1">{formatAmount(value)}</div>
          <img className="w-54 absolute right-0 bottom-0" src={imgList[i]} />
        </div>
      )
    })

    return <div className="flex mr-n2">{list}</div>
  }, [data])

  return children
}
