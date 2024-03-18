import type { CSSProperties, FC } from 'react'
import { IconSVG } from '../../components/icon-svg'

import './index.css'

interface TipType {
  style?: CSSProperties;
  type?: string;
  borderRadius?: boolean;
  desc: string;
}
/**
 * 黄色带喇叭的提示
 * @ icon: 顶部图标
 * @ title: 标题
 *
 * @ export
 * @ class Tips01
 * @ extends {Component}
 */
const Tip: FC<TipType> = (props) => {
  const { borderRadius = false, type = 'warring', style } = props
  return (
    <div
      className={`notice-wap ${
        borderRadius ? 'notice-radius' : ''
      } notice-${type}`}
      style={{ ...style }}
    >
      <IconSVG symbol="icon-xianxing_tongzhi" />
      <ul className="notice-list">
        <li className="notice-item">{props.desc}</li>
      </ul>
    </div>
  )
}

export default Tip
