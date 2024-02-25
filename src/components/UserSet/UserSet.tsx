import { resetExchangePwdApply } from '@/api/User'
import { browserHistory } from '@/router/Routes'
import { store } from '@/store'
import AqButton from '@components/AqButton/AqButton'
import AqCountDownButton, {
    AqCountDownButtonRefProps,
} from '@components/AqCountDownButton/AqCountDownButton'
import AqInput from '@components/AqInput/AqInput'
import AqTab from '@components/AqTab/AqTab'
import LayoutUserFormModal from '@components/LayoutUserFormModal/LayoutUserFormModal'
import PwdForm from '@components/PwdForm/PwdForm'
import { CurrentEmail } from '@utils/Storage'
import React, { useLayoutEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import './UserSet.scss'
import { USER } from '@/store/models/user'

export enum UserSetType {
    ModifySignPwd,
    ResetExchangePwd,
    SignOut,
}

declare global {
    interface Window {
        UserSet?: {
            open(type?: UserSetType): void
            close(): void
        }
    }
}

const tabOptions = [
    { label: '修改登录密码', value: UserSetType.ModifySignPwd },
    { label: '修改交易密码', value: UserSetType.ResetExchangePwd },
    { label: '退出登录', value: UserSetType.SignOut },
]

const UserModal: React.FC = () => {
    const emailValue =
        CurrentEmail.get() || store.getState().user.userInfo.contactEmail || ''
    const CountDown = useRef<AqCountDownButtonRefProps>(null)
    const [show, setShow] = useState<UserSetType | boolean>(false)

    useLayoutEffect(() => {
        window.UserSet = {
            open: (type: UserSetType) => setShow(type),
            close: () => setShow(false),
        }
    }, [])

    // const [visibleConfirm, setConfirmModal] = useState(false)

    return (
        <Provider store={store}>
            <Router history={browserHistory}>
                <LayoutUserFormModal
                    visible={show !== false}
                    onClose={() => setShow(false)}
                    enableClick={false}
                    enableEscape={false}
                    aside={
                        <AqTab
                            value={show as UserSetType}
                            options={tabOptions}
                            onChange={value => setShow(value as UserSetType)}
                        />
                    }
                >
                    {show !== false &&
                        (show === UserSetType.ModifySignPwd ? (
                            <PwdForm onSubmitted={() => UserSet.close()} />
                        ) : show === UserSetType.ResetExchangePwd ? (
                            <>
                                <h2 className="form-name">重置交易密码</h2>
                                <span className="tip">
                                    *若邮箱暂不可用，请联系客服
                                </span>
                                <AqInput
                                    value={emailValue}
                                    readOnly={true}
                                    icons={[{ name: 'icon-email' }]}
                                />
                                <AqCountDownButton
                                    className="btn-submit"
                                    ref={CountDown}
                                    onSubmit={() =>
                                        resetExchangePwdApply({
                                            email: emailValue,
                                        }).then(() => setShow(false))
                                    }
                                />
                            </>
                        ) : (
                            <>
                                <h2 className="form-name">退出登录</h2>
                                <AqButton
                                    className="btn-submit btn-sign-out"
                                    onClick={() => {
                                        store.dispatch({ type: USER.LOGIN_OUT })
                                        setShow(false)
                                    }}
                                >
                                    确认退出
                                </AqButton>
                            </>
                        ))}
                </LayoutUserFormModal>
                {/*<ConfirmModal*/}
                {/*  visible={visibleConfirm}*/}
                {/*  title="退出登录"*/}
                {/*  content="确认退出系统嘛？"*/}
                {/*  texts={{ ok: '退出', cancel: '返回' }}*/}
                {/*  onOk={() => {*/}
                {/*    store.dispatch({ type: USER.LOGIN_OUT })*/}
                {/*    setConfirmModal(false)*/}
                {/*  }}*/}
                {/*  onCancel={() => setConfirmModal(false)}*/}
                {/*  onClose={() => setConfirmModal(false)}*/}
                {/*/>*/}
            </Router>
        </Provider>
    )
}

export default class UserSet {
    private static id = 'user-set-global'

    static open: NonNullable<Window['UserSet']>['open'] = (
        type = UserSetType.ModifySignPwd,
    ) => {
        return UserSet.render().then(() =>
            setTimeout(() => window.UserSet!.open(type)),
        )
    }

    static close: NonNullable<Window['UserSet']>['close'] = () => {
        UserSet.render().then(() => window.UserSet!.close())
    }

    private static render() {
        return new Promise(res => {
            if (document.getElementById(UserSet.id)) res()
            else {
                const dom = document.createElement('div')
                dom.id = UserSet.id
                document.body.appendChild(dom)
                ReactDOM.render(<UserModal />, dom, res)
            }
        })
    }
}
