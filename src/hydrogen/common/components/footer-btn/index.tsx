import { Button } from 'antd-mobile'
import type { ReactNode } from 'react'

export interface BtnProps {
  text?: ReactNode // 按钮文字
  onSumbit?: () => void
}

export const FooterBtn: React.FC<BtnProps> = ({
  text = '提交',
  onSumbit,
}) => {
  return (
    <div className="fixed inset-x-0 bottom-0 p-2 bg-white shadow-sm">
      <Button color="primary" block size="large" onClick={onSumbit}>
        {text}
      </Button>
    </div>
  )
}

export default FooterBtn
