import AqButton from '@components/AqButton/AqButton'
import SvgTag from '@components/SvgTag/SvgTag'
import { useCountDown } from '@utils/CustomHooks'
import classNames from 'classnames'
import React, { forwardRef, useImperativeHandle } from 'react'
import './AqCountDownButton.scss'

export interface AqCountDownButtonRefProps {
    start(): void
}

interface AqCountDownButtonProps {
    className?: string
    children?: React.ReactNode
    disabled?: boolean
    countDownSecond?: number

    successContent?(isRunning: boolean, count: number): React.ReactNode

    onSubmit(): Promise<any>
}

const AqCountDownButton = forwardRef<
    AqCountDownButtonRefProps,
    AqCountDownButtonProps
>(
    (
        {
            className,
            children,
            disabled,
            countDownSecond = 60,
            successContent,
            onSubmit,
        },
        ref,
    ) => {
        const { count, start, isRunning } = useCountDown(countDownSecond)

        useImperativeHandle(ref, () => ({ start }))

        return (
            <AqButton
                className={classNames('aq-button-red', className, {
                    'count-down': isRunning,
                })}
                fill
                onClick={onSubmit}
                disabled={disabled || isRunning}
                successContent={
                    successContent ? (
                        successContent(isRunning, count)
                    ) : !isRunning ? (
                        '重新发送'
                    ) : (
                        <>
                            <SvgTag svgName="icon-success-fill" />
                            已发送，{count}s 后可重发
                        </>
                    )
                }
            >
                {children || '发送重置密码邮件'}
            </AqButton>
        )
    },
)

export default AqCountDownButton
