import ReactLoading from '@auraxy/react-loading'
import React, { useLayoutEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import './BlockLoading.scss'

declare global {
    interface Window {
        BlockLoading?: {
            close(data?: any): void
            open(
                txt?: React.ReactNode,
            ): Promise<
                Parameters<NonNullable<Window['BlockLoading']>['close']>[0]
            >
        }
    }
}

const LoadingEl: React.FC = () => {
    const [show, setShow] = useState<React.ReactNode | boolean>(false)
    const close = useRef<NonNullable<Window['BlockLoading']>['close']>()

    useLayoutEffect(() => {
        window.BlockLoading = {
            open: (txt = true) => {
                setShow(txt)
                return new Promise(res => (close.current = res))
            },
            close: data => {
                setShow(false)
                if (close.current) {
                    close.current(data)
                    close.current = undefined
                }
            },
        }
    }, [])

    return show ? (
        <div className="overlay">
            <ReactLoading />
            {typeof show !== 'boolean' && show}
        </div>
    ) : (
        <></>
    )
}

export default class BlockLoading {
    static id = 'block-loading'

    /** 关闭时返回 close 方法的入参 data */
    static open: NonNullable<Window['BlockLoading']>['open'] = txt => {
        return BlockLoading.render().then(() => window.BlockLoading!.open(txt))
    }

    static close: NonNullable<Window['BlockLoading']>['close'] = data => {
        BlockLoading.render().then(() => window.BlockLoading!.close(data))
    }

    private static render() {
        return new Promise(res => {
            if (document.getElementById(BlockLoading.id)) res()
            else {
                const dom = document.createElement('div')
                dom.id = BlockLoading.id
                document.body.appendChild(dom)
                ReactDOM.render(<LoadingEl />, dom, res)
            }
        })
    }
}
