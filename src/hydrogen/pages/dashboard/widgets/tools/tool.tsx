import { IconSVG } from '@/common/components/icon-svg'
import classNames from 'classnames'
import { useAccessURL } from '../../utils'

export { CommonTools } from './common-tools'

export type ToolProps = {
  icon: string
  title: string
  url?: string
  className?: string
}

export const Tool = ({ icon, title, url, className }: ToolProps) => {
  const forward = useAccessURL(url)
  return (
    <div
      className={classNames('flex text-center gap-1 p-1 flex-col items-center pointer rounded active:bg-gray-100 select-none text-primary', className)}
      onClick={() => forward()}
    >
      <IconSVG symbol={icon} size={32} />
      <div className="text-xs text-gray-700 w-[60px]">{title}</div>
    </div>
  )
}
