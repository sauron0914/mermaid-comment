import type React from 'react'
import { SpinLoading } from 'antd-mobile'

export interface LoadingProps {
  text?: string // 文字描述
}
export const Loading: React.FC<LoadingProps> = ({
  text = '加载中，请耐心等待',
}) => {
  return (
    <div className="spin-loading-wrap flex justify-center pt-[30px]">
      <SpinLoading style={{ '--size': '20px' }} color="primary" />
      <span className="text-sm pl-2 text-gray-500">{text}</span>
    </div>
  )
}
