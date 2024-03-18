import { useState } from 'react'
import { Button, Popup } from 'antd-mobile'
import type { ReactElement } from 'react'

interface PaperFooterButtonsProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  hide?: boolean;
  key: number;
}

interface PaperModalProps {
  button?: PaperFooterButtonsProps[];
  children?: ReactElement;
  btnText: string;
}

export const PaperFooterModal: React.FC<PaperModalProps> = (props) => {
  const { button, btnText } = props
  const [visible, setVisible] = useState(false)
  const onClose = () => {
    setVisible(false)
  }
  return (
    <>
      <Button
        key={btnText}
        color="primary" size="small" className="more-btn"
        style={{ marginLeft: '8px', marginBottom: '4px' }}
        onClick={() => setVisible(pre => !pre)}
      >
        {btnText}
      </Button>
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        // mask={false}
      >
        <div className="text-center bg-[#f5f5f5]">
          <div className="py-1 mb-2">
            {button?.map((item) => {
              return <p className="h-[54px] text-[16px] leading-[54px] text-[#1E1E1E]" key={item.label} onClick={item.onClick}>{item.label}</p>
            })}
          </div>
          <p className="h-[54px] text-[16px] leading-[54px]  text-[#848484] bg-white" onClick={onClose}>取消操作</p>
        </div>
      </Popup>
    </>
  )
}
