import { useState } from 'react'
import { Modal } from 'antd-mobile'
import { IconSVG } from '@/common/components/icon-svg'

const DEFAULT_FOOTER = '确定'
const DEFAULT_TITLE = '提示'
const DEFAULT_ICON_TYPE = 'icon-xianxing_bangzhu'
const DEFAULT_ICON_SIZE = '16px'

function TextWithTips (props) {
  const {
    text,
    textStyle,
    title = DEFAULT_TITLE,
    iconType,
    footer = DEFAULT_FOOTER,
    tips,
    iconSize = DEFAULT_ICON_SIZE,
  } = props

  const [visible, setVisible] = useState(false)

  function onClick (e) {
    e.stopPropagation()
    setVisible(true)
  }

  function onClose () {
    setVisible(false)
  }
  return (
    <div className="inline-block">
      <div className="textwithtips-container" onClick={onClick}>
        <span className="inline-block align-middle" style={textStyle}>{text}</span>
        <IconSVG
          style={{ fontSize: iconSize }}
          className="w-[14px] h-[14px] text-gray-400 ml-5 align-text-top"
          symbol={iconType || DEFAULT_ICON_TYPE}
        />
      </div>
      <Modal
        visible={visible}
        transparent
        onClose={onClose}
        title={title}
        footer={[{ text: footer, onPress: onClose }]}
        className="textwithtips-modal"
      >
        {tips}
      </Modal>
    </div>
  )
}

export default TextWithTips
