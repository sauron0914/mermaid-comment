import SvgTag from '@components/SvgTag/SvgTag'
import { singletonObj } from '@livelybone/singleton'
import React, { useCallback, useLayoutEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'
import './Toast.scss'

enum ToastMode {
    Coexist,
    ReplacePre,
}

interface ToastProps {
    holdTime?: number
    mode?: ToastMode
}

export type ToastMsg = {
    msg: React.ReactNode
    icon?: string
    holdTime?: number
}

export type ToastMsgMix = ToastMsg | React.ReactNode

export function isToastMsg(msg: ToastMsgMix): msg is ToastMsg {
    return !!(msg && (msg as any).msg !== undefined)
}

function packMsg(msg: ToastMsg) {
    const ids = singletonObj('ToastIds', () => Object.create(null))
    let id
    do {
        id = Math.floor(Math.random() * 10000)
    } while (ids[id])
    ids[id] = true
    return { ...msg, id }
}

type HideFn = () => void

interface ToastRefProps {
    open(msg: ToastMsgMix): Promise<HideFn>
}

declare global {
    interface Window {
        GlobalToast?: ToastRefProps
    }
}

type ToastAction = { type: 'add' | 'del'; msg: ReturnType<typeof packMsg> }

const ToastEl: React.FC<ToastProps> = ({
    holdTime = 3000,
    mode = ToastMode.Coexist,
}) => {
    const [msgs, dispatch] = useReducer(
        (preState: ToastAction['msg'][], { type, msg }: ToastAction) => {
            if (type === 'add') {
                setTimeout(() => {
                    dispatch({ type: 'del', msg: msg })
                }, msg.holdTime || holdTime)
                return mode === ToastMode.Coexist ? [...preState, msg] : [msg]
            }

            return preState.filter($msg => {
                return msg.id !== $msg.id
            })
        },
        [],
    )

    const hide = useCallback((msg: ToastAction['msg']) => {
        dispatch({ type: 'del', msg })
    }, [])

    const open = useCallback(
        async (msg: ToastMsgMix) => {
            const $msg = packMsg(!isToastMsg(msg) ? { msg: msg } : msg)
            dispatch({ type: 'add', msg: $msg })
            return () => hide($msg)
        },
        [hide],
    )

    useLayoutEffect(() => {
        window.GlobalToast = { open }
    }, [open])

    return (
        <>
            {msgs.map(msg => (
                <div className="toast-item" key={msg.id}>
                    {msg.icon && <SvgTag svgName={msg.icon} />}
                    {msg.msg}
                </div>
            ))}
        </>
    )
}

const ToastTypeInfo = {
    Warn: { icon: 'icon-warn' },
    Success: { icon: 'icon-success' },
    Error: { icon: 'icon-error' },
}

export default class Toast {
    static id: string = 'toast'

    static custom(msg: ToastMsgMix) {
        return Toast.open(msg)
    }

    static success(msg: ToastMsgMix) {
        const icon = ToastTypeInfo.Success.icon
        return Toast.open(msg, icon)
    }

    static warn(msg: ToastMsgMix) {
        const icon = ToastTypeInfo.Warn.icon
        return Toast.open(msg, icon)
    }

    static error(msg: ToastMsgMix) {
        const icon = ToastTypeInfo.Error.icon
        return Toast.open(msg instanceof Error ? msg.message : msg, icon)
    }

    private static render() {
        return new Promise(res => {
            if (document.getElementById(Toast.id)) res()
            else {
                const dom = document.createElement('div')
                dom.id = Toast.id
                document.body.appendChild(dom)
                ReactDOM.render(<ToastEl />, dom, res)
            }
        })
    }

    private static open(msg: ToastMsgMix, icon?: string) {
        return Toast.render().then(() =>
            window.GlobalToast!.open(
                isToastMsg(msg) ? { ...msg, icon } : { icon, msg: msg },
            ),
        )
    }
}
