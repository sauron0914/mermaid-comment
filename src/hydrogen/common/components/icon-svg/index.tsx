import type { CSSProperties, SVGProps } from 'react'
import type React from 'react'
export interface IconSVGProps extends SVGProps<SVGSVGElement> {
  /**
   * 标示符，对应 iconfont 上的symbol
   */
  symbol: string
  style?: CSSProperties
  size?: number
  className?: string
}

export const IconSVG: React.FC<IconSVGProps> = ({
  symbol,
  className,
  size = 40,
  ...rest
}) => {
  return (
    <svg
      {...rest}
      className={`fill-current overflow-hidden inline-block ${symbol} ${className}`}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
      }}
    >
      <use xlinkHref={`#${symbol}`} />
    </svg>
  )
}

export default IconSVG
