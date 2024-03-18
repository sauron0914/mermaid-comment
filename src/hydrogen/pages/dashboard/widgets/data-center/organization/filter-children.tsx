import { useMemo } from 'react'
import classnames from 'classnames'
import { IconSVG } from '@/common/components/icon-svg'
// import './new-style.less'

const joinName = (data) => {
  if (!data) {
    return ''
  }

  const { deptName, nickName } = data
  return [deptName, nickName].filter(s => !!s).join('_')
}

const ThemeGreen = (props) => {
  const { className, deptName, roleName } = props
  const name = [deptName, roleName].filter(v => v).join('_')
  return (
    <div
      className={classnames('text-sm bg-green-100 text-green-500 p-2', className)}
      {...props.arg}
    >
      数据权限：{name}
      <IconSVG symbol="icon-paixu" className="w-[14px] h-[14px]" />
    </div>
  )
}

export default function FilterChildren (props) {
  const {
    theme,
    roleList,
    disabled,
    deptData,
    className,
    renderChildren,
    lastRole,
    onClick,
  } = props

  const canSelect = useMemo(() => {
    if (disabled) {
      return false
    } else if (roleList.length > 1) {
      // 有多个角色的bd也可以下拉
      return true
    } else if (roleList.length === 0) {
      return false
    }
    const item = roleList.find(
      ({ deptId, userId }) =>
        lastRole?.deptId === deptId && lastRole?.userId === userId,
    )
    return item?.deptLevel !== 'BD'
  }, [disabled, roleList, lastRole])

  const theClassName = classnames('leading-5 text-xs box-border', className)
  const roleName = deptData?.nickName
  const deptName = useMemo(() => {
    const name = joinName(deptData)
    if (name) {
      return name
    }
    if (canSelect === false) {
      return null
    }
    return '选择部门'
  }, [deptData])

  const arg = useMemo(() => {
    if (canSelect) {
      return {
        onClick,
      }
    }
    return {}
  }, [canSelect, onClick])

  const greenTheme = useMemo(() => {
    if (theme === 'GREEN') {
      return (
        <ThemeGreen
          className={className}
          deptName={deptName}
          roleName={roleName}
          arg={arg}
        />
      )
    }
    return null
  }, [theme, className, deptName, roleName, arg])

  return useMemo(() => {
    let child = (
      <div className={theClassName}>
        <div>加载中...</div>
      </div>
    )
    if (!roleList) {
      return child
    }

    let icon
    if (canSelect) {
      icon = <IconSVG symbol="icon-zhankai" className="w-[14px] h-[14px] text-green-500" />
    }

    if (roleName || deptName) {
      child = (
        <div className={theClassName} {...arg}>
          <div className="overflow-hidden truncate whitespace-no-wrap">
            {icon}&nbsp;{deptName}
          </div>
        </div>
      )
    }

    if (renderChildren) {
      const options = {
        roleName,
        deptName,
        lastRole,
        deptData,
      }
      return renderChildren(child, options, arg)
    }

    return greenTheme || child
  }, [
    roleList,
    canSelect,
    theClassName,
    roleName,
    deptName,
    renderChildren,
    greenTheme,
    arg,
    lastRole,
    deptData,
  ])
}
