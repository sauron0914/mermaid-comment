import { forwardRef, useImperativeHandle, useRef } from 'react'
import type { ResourceTree, WidgetProps, WidgetRef } from '../../types'
import { Tool } from './tool'
import { Badge, Card } from 'antd-mobile'
import { useBadgeContent } from './api'
export { CommonTools } from './common-tools'

type ToolCardProps = {
  title: string;
  items: ResourceTree[];
};

export const ToolCard = forwardRef(function TC (
  { title, items }: ToolCardProps,
  ref,
) {
  const { data, refetch } = useBadgeContent()

  useImperativeHandle(ref, () => ({
    refetch,
  }))

  const Wrapper = ({ resCode, children }) => {
    const badgeContent = data?.[resCode]
    return (
      <div className="w-1/5 text-center">
        <Badge
          style={{
            '--top': '8px',
            '--right': '12px',
          }}
          content={Number(badgeContent) === 0 ? null : badgeContent}
        >
          {children}
        </Badge>
      </div>
    )
  }

  return (
    <Card title={title}>
      <div className="flex flex-wrap">
        {items?.map(child => (
          <Wrapper key={child.resCode} resCode={child.resCode}>
            <Tool
              icon={child.iconUrl}
              title={child.resName}
              url={child.accessUrl}
            />
          </Wrapper>
        ))}
      </div>
    </Card>
  )
})

export const Tools = forwardRef<WidgetRef, WidgetProps>(function Tools (
  props,
  ref,
) {
  const card = useRef<any>()
  const { children, resName } = props

  const fetchData = async () => {
    await card.current?.refetch()
  }

  useImperativeHandle(ref, () => ({ fetchData }))

  return <ToolCard title={resName} items={children} ref={card} />
})
