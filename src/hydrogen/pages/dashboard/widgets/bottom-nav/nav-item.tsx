import type { BadgeProps } from 'antd-mobile'
import classNames from 'classnames'

export interface NavItemProps {
  activeIcon?: string
  icon: string
  label: string
  value: string
  link?: string
  badge?: BadgeProps
  active?: boolean
  onClick?: () => void
  accessUrl?: string
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, activeIcon, active, ...rest }) => {
  return (
    <div {...rest} className={classNames('text-xs flex flex-col items-center gap-1 text-gray-500', active && 'text-green-500')}>
      {active ? <img className="w-[20px] h-[20px]" src={activeIcon ?? icon} /> : <img className="w-[20px] h-[20px]" src={icon} />}
      {/* {active ? <IconSVG symbol={activeIcon ?? icon} size={18} /> : <IconSVG symbol={icon} size={18} />} */}
      <span>{label}</span>
    </div>
  )
}

export default NavItem
