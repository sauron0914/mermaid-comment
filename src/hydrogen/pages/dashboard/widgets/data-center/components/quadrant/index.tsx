import { useContext } from 'react'
import { dayjs } from '@dian/app-utils'
import { chunk } from 'lodash'
import './index.css'
import queryString from 'query-string'
import { TextWithTips } from '../index'
import { formatRate } from '../../utils/format'
import TopHeader from '../../organization/top-header'
import { UserOrganization } from '../..'

const QuadrantItem = ({ name, value, rate, x, y, onClick }) => {
  const isRed = x === 2
  const isGreen =
    (x === 0 && y === 1) ||
    (x === 0 && y === 2) ||
    (x === 1 && y === 1) ||
    (x === 1 && y === 2)

  const titleColor = isGreen ? '#1EC15D' : isRed ? '#FD2C00' : '#000'

  return (
    <div className="box-content relative text-center flex-1/3 p-10 md:p-6 h-66 flex flex-col justify-between border-t border-r border-gray-300" onClick={onClick}>
      <strong
        className="text-lg font-bold underline"
        style={{ color: titleColor }}
      >
        {value || 0}人
      </strong>
      <div className="text-gray-400 text-xs">占比{formatRate(rate)}</div>
      <div className="text-xs text-gray-600">{name}</div>
    </div>
  )
}

const Quadrant = ({ pointList, desp, tab, tabs, userRole }) => {
  const checkRole = TopHeader.useCheckRole(userRole)

  let coords
  try {
    coords = desp && typeof desp === 'string' ? JSON.parse(desp) : null
  } catch (err) {
    coords = null
  }
  const chunkedData = chunk(pointList.itemList, 3)
  const handleClickItem = ({ asField, labelIds, name }) => {
    // 人员
    const jumpTab = tabs.find(e => e.tabType === 2)
    if (jumpTab) {
      const urlQuery: any = {
        tab: jumpTab.key,
        perTab: pointList?.type,
        activeIndexs: [asField],
        queryRoleId: tab.tabName.split(',')[1],
        bizDate: dayjs().subtract(1, 'day')
          .format('YYYYMMDD'),
        dateType: '3',
      }

      tab.tabName && (urlQuery.device = name)
      labelIds && (urlQuery.labelList = labelIds)
      checkRole(() => {
        location.href = `/merak/app/decision/member-board?${queryString.stringify(urlQuery)}`
      })
    }
  }

  return (
    <div className="bg-white p-6">
      <div className="relative ml-30 border-l border-b border-green-500">
        <div className="absolute left-[-15px] top-5 text-green-500 text-xs">Y</div>
        <div className="absolute right-5 bottom-[-20px] text-green-500 text-xs">X</div>
        {coords && (
          <>
            <div className="quadrant-coord-x">
              {coords.x.range.map((e, i) => (
                <b key={i}>{e}</b>
              ))}
              <b>0</b>
            </div>
            <div className="quadrant-coord-y">
              {coords.y.range.map((e, i) => (
                <b key={i}>{e}</b>
              ))}
            </div>
          </>
        )}

        {chunkedData.map((e, xi) => (
          <div
            key={`quadrant-${xi}`}
            className="flex justify-start shadow-md bg-white inline-block"
            style={{ width: `${e.length * 33}%` }}
          >
            {e.map((item, yi) => (
              <QuadrantItem
                key={`quadrant-item-${yi}`}
                name={item.name}
                x={xi}
                y={yi}
                onClick={() => handleClickItem(item)}
                value={item.data[tab?.tabIndex].value}
                rate={item.data[tab?.tabIndex].rate}
              />
            ))}
          </div>
        ))}
      </div>
      {coords && (
        <>
          <div className="bg-gray-100 flex text-gray-700 text-xs mt-30 h-30 leading-30 rounded-full">
            <div className="flex-1 text-center">
              {coords.x.name}
              {coords.x.help && (
                <TextWithTips
                  text={name}
                  iconSize="14px"
                  title={name}
                  footer="我知道了"
                  tips={coords.x.help}
                />
              )}
            </div>
            <div className="flex-1 text-center">
              {coords.y.name}
              {coords.y.help && (
                <TextWithTips
                  text={name}
                  iconSize="14px"
                  title={name}
                  footer="我知道了"
                  tips={coords.y.help}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Quadrant
