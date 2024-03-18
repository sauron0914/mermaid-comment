import { Image } from 'antd-mobile'
import type React from 'react'

interface EmptyProps {
  tip?: string;
  children?: React.ReactNode;
}

const Empty = (props: EmptyProps) => {
  return (
    <div className="mt-8">
      <Image
        className="m-auto"
        src="https://fed.dian.so/image/036e6287ac7b533bae3d57a7abf3be40.png"
        width={300}
        height={150}
        fit="fill"
      />
      <div className="text-[#848484] text-center mb-8">{props.tip}</div>
      {props.children}
    </div>
  )
}

export default Empty
