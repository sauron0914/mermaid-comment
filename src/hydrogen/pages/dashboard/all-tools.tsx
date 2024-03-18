import { useAllTools } from './api'
import { ToolCard } from './widgets/tools'
import { Anchor } from './components/anchor'

export default function DashboardAllTools () {
  const allTools = useAllTools()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col gap-2 p-2 pt-[44px]">
      <div className="fixed top-0 w-full left-0 bg-white z-10">
        <Anchor
          offsetTop={44}
          items={allTools?.map(item => ({ title: item.resName, id: item.resCode }))}
        />
      </div>

      {allTools?.map(tools => <div key={tools.resCode} id={tools.resCode}>
        <ToolCard title={tools.resName} items={tools.children} />
      </div>)}
    </div>
  )
}
