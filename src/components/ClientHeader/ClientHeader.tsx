import { projectName } from '@/config/config'
import { AppUrls, browserHistory } from '@/router/Routes'
import { withRouter } from 'react-router'
import customConnect, { DefaultProps } from '@/store/custom-connect'
import SvgTag from '@components/SvgTag/SvgTag'
import UserSet from '@components/UserSet/UserSet'
import React, { useState, useEffect, useRef } from 'react'
import './ClientHeader.scss'
import { getNumOfUnread } from '@/api/Msg'
import { Token, CurrentEmail, CompanyListStorage } from '@/common/utils/Storage'
import ReactPopper, { TriggerType } from '../AqPopper/AqPopper'
import { switchAccount } from '@/api/User'
import { GetListCompanyResult } from '@/api/types/User.type'

let oldCurrent: string = ''

const ClientHeader: React.FC<DefaultProps> = ({ userInfo, history, meta }) => {
    const [msgCount, setMsgCount] = useState<number>(0)
    const PopperRef = useRef(null)
    const setMsgBread = () => {
        if (window.SetBreadcrumb) {
            browserHistory.location.pathname === AppUrls.MsgCenter().pathname &&
                window.SetBreadcrumb(<>通知</>)
            return true
        } else {
            return false
        }
    }
    useEffect(() => {
        const timer = setInterval(() => {
            setMsgBread() && clearInterval(timer)
        }, 300)
    }, [])

    if (meta && meta.hideHeader) return <></>

    const toMsgCenter = () => {
        history.push(AppUrls.MsgCenter())
        setMsgBread()
    }
    const { pathname } = history.location
    if (oldCurrent !== pathname) {
        oldCurrent = pathname
        setTimeout(() => {
            meta &&
                meta.requireAuth &&
                Token.get() &&
                getNumOfUnread().then(res => {
                    setMsgCount(res)
                })
        }, 500)
    }

    const setCompany = (item: GetListCompanyResult) => {
        ;(PopperRef.current as any).hide()
        switchAccount({
            companyId: item.companyId,
        })
    }

    return (
        <header className="client-header">
            <span className="client-header-box">
                <span className="client-header-title">
                    <SvgTag svgName="icon-header-logo" />
                    {projectName}
                    {userInfo ? (
                        <span className="client-header-company-name">
                            | {userInfo.name}
                        </span>
                    ) : (
                        ''
                    )}
                    {userInfo
                        ? CompanyListStorage.get() &&
                          CompanyListStorage.get()!.list.length > 1 && (
                              <div>
                                  <div className="client-header-change-company">
                                      切换
                                  </div>
                                  <ReactPopper
                                      className="client-header-company-list"
                                      trigger={TriggerType.click}
                                      ref={PopperRef}
                                  >
                                      {CompanyListStorage.get()!.list.map(
                                          item => (
                                              <div
                                                  key={item.companyId}
                                                  className="client-header-company-item"
                                                  onClick={() =>
                                                      setCompany(item)
                                                  }
                                              >
                                                  {item.companyName}
                                              </div>
                                          ),
                                      )}
                                  </ReactPopper>
                              </div>
                          )
                        : ''}
                </span>
                <div className="right">
                    {userInfo ? (
                        <>
                            <span
                                className="info"
                                onClick={() => UserSet.open()}
                            >
                                {CurrentEmail.get() || userInfo.contactEmail}
                            </span>
                            <span className="btn" onClick={toMsgCenter}>
                                <SvgTag svgName="icon-notification" />
                                消息
                                {msgCount > 0 && (
                                    <i> {msgCount > 99 ? '99+' : msgCount} </i>
                                )}
                            </span>
                        </>
                    ) : (
                        ''
                    )}
                    <a
                        className="btn"
                        href="http://wpa.qq.com/msgrd?v=3&uin=1990442884&site=qq&menu=yes"
                        target="service"
                    >
                        <SvgTag svgName="icon-service" />
                        客服
                    </a>
                </div>
            </span>
        </header>
    )
}

export default customConnect()(withRouter(ClientHeader))
