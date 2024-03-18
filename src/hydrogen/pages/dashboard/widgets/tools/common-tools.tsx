import { forwardRef, useImperativeHandle } from 'react'
import type { WidgetRef } from '../../types'
import { useCommonTools, useCommonToolsCodeList } from './api'
import { Card } from 'antd-mobile'
import { Tool } from './tool'

export const CommonTools = forwardRef<WidgetRef>(function CommonTools (
  props,
  ref,
) {
  const [codeList] = useCommonToolsCodeList()
  const { commonTools } = useCommonTools(codeList ?? [])

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchData = async () => {}

  useImperativeHandle(ref, () => ({ fetchData }))

  return (
    <Card title="常用工具" bodyClassName="">
      <div className="flex flex-wrap">
        {commonTools?.map(child => (
          <Tool
            className="w-1/5"
            key={child.resCode}
            icon={child.iconUrl}
            title={child.resName}
            url={child.accessUrl}
          />
        ))}
        <Tool
          className="w-1/5"
          icon="icon-quanbu"
          title="全部工具"
          url="/dashboard/all-tools"
        />
        <Tool
          className="w-1/5"
          icon="icon-bianji"
          title="编辑"
          url="/dashboard/common-tools"
        />
      </div>
    </Card>
  )
})
