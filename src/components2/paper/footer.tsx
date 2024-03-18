import React from 'react'
import type { ReactElement } from 'react'
import { Button, Divider } from 'antd-mobile'
import type { ButtonProps } from 'antd-mobile'

interface PaperFooterButtonsProps extends ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  hide?: boolean;
  popupModal?: ReactElement,
}

interface PaperFooterProps {
  button?: PaperFooterButtonsProps[];
  children?: ReactElement;
}

export const PaperFooter: React.FC<PaperFooterProps> = (props) => {
  const {
    button = [],
    children,
  } = props
  if (children) return children
  if (!button.length) {
    return null
  }
  const buttonFilterHide = button.filter(item => !item.hide)

  return (
    <div>
      {
        buttonFilterHide.length > 0 && <Divider className="my-3" />
      }
      <div style={{ textAlign: 'right' }}>
        {buttonFilterHide.map((b) => {
          if (b) {
            if (React.isValidElement(b)) {
              return b
            }
            // 兼容合同签约弹框
            if (React.isValidElement(b.popupModal)) {
              return <div className="inline-block" key={b.label}>{b.popupModal}</div>
            }
            return (
              <Button
                key={b.label}
                disabled={b.disabled}
                shape={b.shape || 'default'} // 'default' | 'rounded' | 'rectangular'
                size={b.size || 'small'} // 'mini' | 'small' | 'middle' | 'large'
                color={b.color || 'primary'} // 'default' | 'primary' | 'success' | 'warning' | 'danger'
                fill={b.fill || 'outline'} // 'solid' | 'outline' | 'none'
                type={b.type || 'button'}
                onClick={b.onClick}
                style={{ marginLeft: '8px', marginBottom: '4px', fontSize: '14px', height: '28px', ...b.style }}
              >
                {b.label}
              </Button>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
