import { AppUrls } from '@/router/Routes'
import Nav, { NavInfo } from '@components/ClientSidebar/Nav/Nav'
import useStateTrackProp from 'use-state-track-prop'
import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    useLayoutEffect,
    useMemo,
    useState,
    useEffect,
} from 'react'
import './ClientSidebar.scss'
import { getUserAgentList } from '@/api/User'
import useForceUpdate from '@livelybone/use-force-update'

export let menu = [
    {
        icon: 'icon-home',
        txt: '首页',
        route: AppUrls.Dashboard().pathname,
    },
    {
        icon: 'icon-settlement-logo',
        txt: '发起结算',
        route: AppUrls.SettlementApply().pathname,
    },
    {
        txt: '结算中心',
        subRoutes: [
            {
                txt: '结算记录-按批次',
                route: AppUrls.ApplyRecords().pathname,
            },
            {
                txt: '结算记录-按人',
                route: AppUrls.PayIssueRecords().pathname,
            },
        ],
    },
    {
        txt: '劳动者管理',
        subRoutes: [
            {
                txt: '劳动者名单',
                route: AppUrls.PayeeList().pathname,
            },
            {
                txt: '业务统计',
                route: AppUrls.PayeeStatistics().pathname,
            },
        ],
    },
    {
        txt: '商户中心',
        subRoutes: [
            {
                txt: '企业管理',
                route: AppUrls.CompanyInfo().pathname,
            },
            {
                txt: '财务管理',
                route: AppUrls.FinancialManagement().pathname,
            },
            {
                txt: '发票管理',
                route: AppUrls.InvoiceApply().pathname,
            },
        ],
    },
    {
        txt: '帮助中心',
        subRoutes: [
            {
                txt: '帮助手册',
                route: AppUrls.HelpManual().pathname,
            },
        ],
    },
]

declare global {
    interface Window {
        SetBreadcrumb: Dispatch<SetStateAction<ReactNode>>
    }
}

const ClientSidebar: React.FC = () => {
    const [routes, setRoutes] = useState<NavInfo[]>([])
    const [, forceUpdate] = useForceUpdate()
    const [breadcrumb, setBreadcrumb] = useStateTrackProp<ReactNode>(
        useMemo(
            () =>
                routes.map((r, i) => {
                    if (i === 0) {
                        return r.txt
                    } else if (i === routes.length - 1) {
                        return (
                            <React.Fragment key={i}>
                                {' '}
                                / <span className="bread-end"> {r.txt} </span>
                            </React.Fragment>
                        )
                    } else {
                        return `/ ${r.txt}`
                    }
                }),
            [routes],
        ),
    )

    useLayoutEffect(() => {
        window.SetBreadcrumb = setBreadcrumb
    }, [setBreadcrumb])

    useEffect(() => {
        getUserAgentList().then(res => {
            if (res.some(item => item.needIndividualBusiness)) {
                if (menu[3].subRoutes![1].txt !== '工商注册') {
                    menu[3].subRoutes!.splice(1, 0, {
                        txt: '工商注册',
                        route: AppUrls.Business().pathname,
                    })
                    forceUpdate()
                }
            } else {
                if (menu[3].subRoutes![1].txt === '工商注册') {
                    menu[3].subRoutes!.splice(1, 1)
                    forceUpdate()
                }
            }
        })
    }, [forceUpdate])
    return (
        <>
            <aside className="client-sidebar">
                {menu.map(item => (
                    <Nav nav={item} key={item.txt} onActive={setRoutes} />
                ))}
            </aside>
            <nav className="breadcrumb">{breadcrumb}</nav>
        </>
    )
}

export default ClientSidebar
