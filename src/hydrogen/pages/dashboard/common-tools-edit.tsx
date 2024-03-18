import { Card, Badge } from 'antd-mobile'
import { motion } from 'framer-motion'
import { useCommonTools, useCommonToolsCodeList, bls } from './widgets/tools/api'
import { Anchor } from './components/anchor'
import { Tool } from './widgets/tools/tool'
import './styles.css'
import { useResizeObserver } from './utils/use-resize-observer'
import { cookie } from '@dian/app-utils'

const roleName = cookie.get('current_role')

export default function DashboardCommonToolsEdit () {
  const [codeList = [], setCodeList] = useCommonToolsCodeList()
  const { commonTools, allTools } = useCommonTools(codeList ?? [])
  const [fixedRef, rect] = useResizeObserver()

  const handleSetCommonTools = (list) => {
    setCodeList(list)
    bls.set(`commonTools-${roleName}`, list)
  }

  const handleRemove = (code) => {
    const list = codeList.filter(c => c !== code)
    handleSetCommonTools(list)
  }
  const handleAdd = (code) => {
    const list = [...codeList, code]
    handleSetCommonTools(list)
  }

  return (
    <div className="hydrogen-dashboard badge-edit min-h-screen bg-gray-100">
      <div className="fixed top-0 w-full left-0 bg-white z-10 shadow" ref={fixedRef}>
        <Anchor
          offsetTop={rect.height + 6}
          items={allTools?.map(item => ({ title: item.resName, id: item.resCode }))}
        />
        <Card title="常用工具" bodyClassName="flex flex-wrap">
          {commonTools?.filter(child => !!child.accessUrl && child.iconUrl)
            ?.map(child =>
              <motion.div className="w-1/5 text-center" layout="position" layoutId={child.resCode} key={child.resCode} onClick={() => handleRemove(child.resCode)}>
                <Badge content="-" style={{ '--top': '4px', '--right': '8px' }} wrapperClassName="w-full">
                  <Tool className="pointer-events-none" icon={child.iconUrl} title={child.resName} url={child.accessUrl} />
                </Badge>
              </motion.div>)}
        </Card>
      </div>
      <div
        className="flex flex-col gap-2"
        style={{
          paddingTop: rect.height + 6,
        }}
      >
        {allTools?.map(tools => <motion.div layout="position" key={tools.resCode} id={tools.resCode}>
          <Card title={tools.resName} className="mx-2" bodyClassName="flex flex-wrap">
            {tools.children?.map(child =>
              <motion.div className="w-1/5 text-center" layout={false} layoutId={child.resCode} key={child.resCode} onClick={() => handleAdd(child.resCode)}>
                <Badge content="+" color="#37bf38" style={{ '--top': '4px', '--right': '8px' }} wrapperClassName="w-full">
                  <Tool className="pointer-events-none" icon={child.iconUrl} title={child.resName} url={child.accessUrl} />
                </Badge>
              </motion.div>)}
          </Card>
        </motion.div>)}
      </div>
    </div>
  )
}
