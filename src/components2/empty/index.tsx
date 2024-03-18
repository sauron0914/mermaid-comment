import type { ReactNode } from 'react'

export enum EmptyType {
  NoData = 0,
  NoPermission,
  NoNetwork,
  NoService,
}
const IMG_LIST = [
  {
    type: EmptyType.NoData,
    img: 'https://fed.dian.so/image/036e6287ac7b533bae3d57a7abf3be40.png',
  },
  {
    type: EmptyType.NoPermission,
    img: 'https://fed.dian.so/image/3934ba91c0115cda313743dd3ce33409.png',
  },
  {
    type: EmptyType.NoNetwork,
    img: 'https://fed.dian.so/image/677cefb999c6235eb0600d76f6a1191a.png',
  },
  {
    type: EmptyType.NoService,
    img: 'https://fed.dian.so/image/71508f24bf364991e3abee8bdfce2eaf.png',
  },
]
export interface EmptyProps {
  /**
   * 文字描述
   */
  text?: ReactNode
  /**
   * 0无数据 - 1无权限 - 2无网络 - 3无服务 - 默认 0
   */
  type?: EmptyType
  /**
   * 标题内容
   */
  title?: ReactNode
}

const Empty: React.FC<EmptyProps> = ({
  text = '暂无数据',
  type = EmptyType.NoData,
  title,
}) => {
  return (
    <div className="text-center">
      <img className="w-full py-0 px-14 box-border" src={IMG_LIST[type].img} alt="" />
      {title && <h2 className="text-base font-bold text-black mt-4">{title}</h2>}
      <div className="w-70 mt-3 m-auto mb-6 text-xs text-gray-500">{text}</div>
    </div>
  )
}

export default Empty
