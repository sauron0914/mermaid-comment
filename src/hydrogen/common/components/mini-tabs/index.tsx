import { useEffect, useState } from 'react'

export interface TabOption {
  title: string
  key: string
}

export interface MiniTabsProps {
  options: TabOption[]
  active?: string
  onChange?: (currentTab: TabOption) => void
}

export const MiniTabs = (props) => {
  const {
    options = [],
    active,
    onChange,
  } = props

  const [current, setCurrent] = useState<string | undefined>(active)
  const handleTabClick = (option) => {
    setCurrent(option.key)
    onChange && onChange(option)
  }

  useEffect(() => {
    // 初始化默认选中第一个
    if (!current && options.length > 0) {
      setCurrent(options[0].key)
    }
  }, [options, current])

  // 如果外部传入的active变化了要更新内部的current
  useEffect(() => {
    if (active) {
      setCurrent(active)
    }
  }, [active])

  return (
    <div className="flex justify-between items-center space-x-1">
      {
        options.map((option) => {
          const { title, key } = option
          return (
            <div
              className={`
                rounded
                py-1
                px-2
                text-[10px]
                leading-[14px]
                cursor-pointer
                ${current === key ? 'text-[#E6FFEE] bg-primary' : 'bg-[#F8F8F8] text-[#585858]'}
              `}
              key={key}
              onClick={() => handleTabClick(option)}
            >
              {title}
            </div>
          )
        })
      }
    </div>
  )
}
