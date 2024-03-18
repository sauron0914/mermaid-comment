import type React from 'react'
import { useCallback, useMemo } from 'react'
import classnames from 'classnames'
import { Tabs } from 'antd-mobile'
import { DateTypeEnum } from './props-type'
import './new-style.less'

const typeMap = {
  [DateTypeEnum.Day]: { value: DateTypeEnum.Day, label: '日', title: '按日选择' },
  [DateTypeEnum.Week]: { value: DateTypeEnum.Week, label: '周', title: '按周选择' },
  [DateTypeEnum.Month]: { value: DateTypeEnum.Month, label: '月', title: '按月选择' },
}
type HandleChange = (type: DateTypeEnum) => void

// 传入的value和onchange返回的value都是周/月的最后一天。因为绩效周的问题，所以会出现值不一定是周末的情况
type SelectProp = {
  type: DateTypeEnum
  onlyMonth: boolean
  onChange: HandleChange
  dateTypeSelectInPicker?: boolean
}
const DateTypeSelect: React.FC<SelectProp> = ({
  type,
  onlyMonth,
  onChange,
  dateTypeSelectInPicker,
}) => {
  const tabs = onlyMonth ? [typeMap[DateTypeEnum.Month]] : Object.values(typeMap)

  const handleTabChange = useCallback((key) => {
    type !== key && onChange(key)
  }, [onChange, type])

  const children = useMemo(() => {
    const keys = onlyMonth ? [DateTypeEnum.Month] : Object.keys(typeMap)

    return keys.map((key) => {
      return (
        <div
          key={key}
          className={classnames('date-type-option', {
            active: type === typeMap[key]?.value,
          })}
          onClick={() => handleTabChange(key)}
        >
          {typeMap[key]?.label}
        </div>
      )
    })
  }, [onlyMonth, type, handleTabChange])

  if (dateTypeSelectInPicker) {
    return (
      <Tabs
        defaultActiveKey={type}
        onChange={handleTabChange}
      >
        {
          tabs.map(tab => (
            <Tabs.Tab title={tab.label} key={tab.value} />
          ))
        }
      </Tabs>
    )
  }

  return <div className="date-type-select">{children}</div>
}

export default DateTypeSelect
