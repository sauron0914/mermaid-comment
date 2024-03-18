import type { CSSProperties, SVGProps } from 'react'
import type React from 'react'
export interface IconSVGProps extends SVGProps<SVGSVGElement> {
  /**
   * 标示符，对应 iconfont 上的symbol
   */
  symbol: string
  style?: CSSProperties
  className?: string
}

export const IconSVG: React.FC<IconSVGProps> = ({
  symbol,
  className,
  ...rest
}) => {
  return (
    <svg
      {...rest}
      className={`fill-current overflow-hidden w-5 h-5 ${symbol} ${className} inline-block`}
      aria-hidden="true"
    >
      <use xlinkHref={`#${symbol}`} />
    </svg>
  )
}

export default IconSVG
