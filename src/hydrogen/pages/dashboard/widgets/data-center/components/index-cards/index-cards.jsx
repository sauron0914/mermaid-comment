/* eslint-disable eqeqeq */
import {
  useState,
  useMemo,
  useCallback,
  useReducer,
  useContext,
} from 'react'
import classnames from 'classnames'
import { Modal, Popover } from 'antd-mobile'
import { IconSVG } from '@/common/components/icon-svg'
import Header from './header'

import Context from './context'
import models from './models'
import { formatAmount, formatRate } from '../../utils/format'

const { Item } = Popover

const defaultColumnCount = 2

function IndexCardsWrap (props) {
  const [state, dispatch] = useReducer(models.reducer, models.state)
  return (
    <Context.Provider value={{ state, dispatch }}>
      <IndexCards {...props} />
    </Context.Provider>
  )
}

/**
 * 指标卡组件.
 * @example <IndexCards data={data}><IndexCards.Header>标题</IndexCards.Header></IndexCards>
 *
 * @param {'simple'} mode 什么样式模式，默认无
 * @param {Number} [columnCount=2] 多少列
 * @param {Boolean} visible 折叠展开
 * @param {Boolean} collapsible 是否可折叠
 * @param {Array} colors 颜色池，不会影响同环比
 * @param {Number} afterShrinkCount 点击收缩后，展示的指标个数，如果设置过data.isHide，那么此参数无效
 * @param {Object} data
 * @param {Any} data.key
 * @param {String} data.title
 * @param {String} data.desc 特殊说明，这个参数有值的时候标题旁边会出现问号
 * @param {Boolean} data.anchor 是否可以跳转，可以跳转的指标点击后会出发onAnchor
 * @param {Boolean} data.isHide 是否可隐藏，在 visible 设置为false的时候隐藏
 * @param {Number} data.value 指标数值
 * @param {Number} data.mom 环比，没有的时候不显示
 * @param {Number} data.yoy 同比
 * @param {Function} onAnchor 这里可以自定义跳转逻辑
 */

function IndexCards (props) {
  const {
    data,
    mode,
    columnCount,
    collapsible,
    afterShrinkCount,
    colors,
  } = props
  const { state } = useContext(Context)
  const [visible, setVisible] = useState(!!props.visible)

  const onAnchor = (key, item) => {
    const { popoverData, anchorParams } = item
    if (popoverData && popoverData.length > 1) {
      return false
    }
    props.onAnchor && props.onAnchor(key, anchorParams)
  }

  const styleObject = useMemo(() => {
    const width = 100 / (columnCount || defaultColumnCount)
    return {
      width: `${width}%`,
    }
  }, [columnCount])

  const header = useMemo(() => {
    if (!state.header) {
      return null
    }
    return <div className="p-2 border-b border-gray-200 text-xs">{state.header}</div>
  }, [state.header])

  const cardEls = useMemo(() => {
    let list = data
    if (visible === false) {
      list = list.filter(item => !item.isHide)
      if (list.length === data.length && collapsible && afterShrinkCount) {
        list = list.slice(0, afterShrinkCount)
      }
    }
    return list.map((item, i) => {
      const { key, title, desc, anchor, ...arg } = item
      const color = colors && colors[i]

      let child = (
        <Card
          key={key}
          data={arg}
          title={title}
          desc={desc}
          anchor={anchor}
          color={color}
          onAnchor={props.onAnchor}
        />
      )
      if (mode === 'simple') {
        child = (
          <SimpleCard
            key={key}
            data={arg}
            title={title}
            anchor={anchor}
            color={color}
          />
        )
      }

      return (
        <div
          key={key}
          className="box-border border-r border-gray-200 border-b"
          style={styleObject}
          onClick={() => anchor && onAnchor(key, item)}
        >
          <div className="h-full bg-white verflow-hidden">{child}</div>
        </div>
      )
    })
  }, [visible, data, columnCount, mode, collapsible, afterShrinkCount, props.onAnchor])

  const flexible = useMemo(() => {
    if (collapsible !== true) {
      return null
    }
    return (
      <div className="flex justify-center items-center pt-[12px] pb-[8px] mb-[-8px]" onClick={() => setVisible(!visible)}>
        {visible
          ? (
            <>
              收起
              <IconSVG symbol="icon-xianxing_shang" className="w-[14px] h-[14px]" />
            </>
          )
          : (
            <>
              展开
              <IconSVG symbol="icon-jiantou0101" className="w-[14px] h-[14px]" />
            </>
          )}
      </div>
    )
  }, [collapsible, visible])

  return (
    <div className="my-2">
      <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
        {props.children}
        {header}
        <div className="flex flex-wrap mr-[-1px] mb-[-1px] bg-white">{cardEls}</div>
      </div>
      {flexible}
    </div>
  )
}

function SimpleCard (props) {
  const { data, title, anchor, color } = props
  const value = formatAmount(data.value)

  return (
    <div className="h-full flex flex-col py-[10px] px-[6px] text-gray-600 text-center">
      <div className="text-[14px] font-semibold">
        {anchor ? <u style={{ color }}>{value}</u> : value}
      </div>
      <div className="text-[12px] mt-[6px]">{title}</div>
    </div>
  )
}

function Card (props) {
  const { data, title, desc, anchor, color } = props
  const [popVisible, setPopVisible] = useState(false)

  const onClick = (event, title, desc) => {
    event.stopPropagation()
    Modal.alert({
      title,
      content: desc,
    })
  }

  const onSelect = (node, index) => {
    const { popoverData, anchorParams } = data
    const option = {
      popoverValue: popoverData[index],
    }
    setPopVisible(false)
    props.onAnchor && props.onAnchor(null, anchorParams, option)
  }

  const cardTitle = useMemo(() => {
    if (desc) {
      return (
        <div
          className="grow flex items-start"
          onClick={e => onClick(e, title, desc)}
        >
          <div className="text-[12px] origin-left break-all leading-6 text-gray-800">
            {title}
            &nbsp;
            <IconSVG symbol="icon-xianxing_bangzhu" className="w-[14px] h-[14px]" />
          </div>
        </div>
      )
    }
    return (
      <div className="grow flex items-start">
        <div className="text-[12px] origin-left break-all leading-6 text-gray-800">{title}</div>
      </div>
    )
  }, [title, desc])

  const renderRate = useCallback((value, title) => {
    const classNames = classnames({
      'text-red-600': value > 0,
      'text-green-500': value < 0,
    })
    return (
      <div className="min-w-6 flex items-center flex-wrap text-[10px] origin-left justify-between">
        <span className="mr-[6px]">{title}</span>
        <span className={classNames}>
          {value > 0 && '+'}
          {formatRate(value, 2, '%')}
        </span>
      </div>
    )
  }, [])

  const overlay = useMemo(() => {
    const { popoverData } = data

    if (popoverData && popoverData.length > 1) {
      return popoverData.map((label) => {
        return (
          <Item key={label} value={label}>
            {label}
          </Item>
        )
      })
    }
    return null
  }, [data.popoverData])

  return (
    <div className="h-full flex flex-col p-[8px] text-gray-500">
      {cardTitle}
      <Popover
        visible={popVisible}
        overlayClassName="fortest"
        overlayStyle={{ color: 'currentColor' }}
        overlay={overlay}
        align={{
          overflow: { adjustY: 0, adjustX: 0 },
          offset: [-10, 0],
        }}
        onVisibleChange={() => setPopVisible(!popVisible)}
        onSelect={onSelect}
      >
        <div className="flex items-start">
          <div className="flex items-center text-[14px] py-[8px] text-gray-800 font-semibold align-bottom flex-1">
            <span style={{ color }}>{formatAmount(data.value)}</span>
            {anchor
              ? (
                <div className="w-[18px] h-[18px]">
                  <IconSVG symbol="icon-xianxing_you" className="w-[14px] h-[14px]" />
                </div>
              )
              : null}
          </div>
          <div className="mt-[4px]">
            {data.mom == undefined || data.mom === ''
              ? null
              : renderRate(data.mom, '环')}
            {data.yoy == undefined || data.mom === ''
              ? null
              : renderRate(data.yoy, '同')}
          </div>
        </div>
      </Popover>
    </div>
  )
}

IndexCardsWrap.Card = Card
IndexCardsWrap.Header = Header

export default IndexCardsWrap
