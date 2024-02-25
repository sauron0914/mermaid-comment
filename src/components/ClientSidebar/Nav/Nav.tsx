import SvgTag from '@components/SvgTag/SvgTag'
import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Nav.scss'
import { menu } from '../ClientSidebar'

export interface NavInfo {
    txt: string
    icon?: string
    route?: string
    subRoutes?: NavInfo[]
}

export interface NavProps {
    nav: NavInfo
    level?: number
    onActive?: (routes: NavInfo[]) => void
}

const Nav: React.FC<NavProps> = ({ level = 1, onActive, nav }) => {
    const isActivated = window.location.pathname.startsWith(nav.route as string)

    const $onActive = useCallback(
        routes => {
            if (onActive) onActive([nav, ...routes])
        },
        [nav, onActive],
    )

    useEffect(() => {
        if (isActivated && onActive) onActive([nav])
    }, [isActivated, nav, onActive])

    const style = { textIndent: `${(level > 1 ? level : 0.5) * 30}px` }

    const className = {
        'has-children': nav.subRoutes && nav.subRoutes.length > 0,
        active: isActivated,
    }
    const [expand, setExpand] = useState(true)

    const isExpand = menu.some(item => {
        return (
            item.txt === nav.txt &&
            item.subRoutes &&
            item.subRoutes.some(it => {
                return window.location.pathname.startsWith(it.route as string)
            })
        )
    })

    useEffect(() => {
        if (isExpand) {
            setExpand(true)
        }
    }, [isExpand])

    const children = (
        <>
            {nav.icon && <SvgTag className="icon" svgName={nav.icon} />}
            {nav.subRoutes && nav.subRoutes.length > 0 ? (
                <>
                    <span
                        className={classNames('expand-tag', {
                            expanded: expand,
                            'is-activated': isExpand,
                        })}
                        onClick={() => setExpand(!expand)}
                    >
                        {nav.txt}
                        <SvgTag
                            className="icon-arrow"
                            svgName="icon-arrow-right"
                        />
                    </span>
                    {expand && (
                        <div className="sub-routes">
                            {nav.subRoutes.map(item => (
                                <Nav
                                    nav={item}
                                    level={level + 1}
                                    key={item.txt}
                                    onActive={$onActive}
                                />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                nav.txt
            )}
        </>
    )

    return nav.route ? (
        <Link
            className={classNames('nav', className)}
            style={style}
            to={nav.route}
        >
            {children}
        </Link>
    ) : (
        <div className={classNames('nav no-link', className)} style={style}>
            {children}
        </div>
    )
}

export default Nav
