import { ReactAsyncButton, ButtonProps } from '@auraxy/react-async-button'
import ReactLoading from '@auraxy/react-loading'
import React from 'react'
import classNames from 'classnames'
import './AqButton.scss'

// @ts-ignore
interface IAqButton extends ButtonProps {
    className?: string
    fill?: boolean
    rimless?: boolean
    onClick?(ev?: React.MouseEvent): any
}

const AqButton: React.FC<IAqButton> = ({
    children,
    onClick,
    className,
    fill,
    rimless,
    loadingContent,
    ...rest
}) => {
    const buttonClick = async (ev: React.MouseEvent) => {
        return onClick && onClick(ev)
    }
    return (
        <ReactAsyncButton
            {...rest}
            className={classNames(
                'aq-button',
                fill ? 'aq-fill' : rimless ? 'rimless' : '',
                className,
            )}
            onClick={buttonClick}
            loadingContent={loadingContent || <ReactLoading />}
        >
            {children}
        </ReactAsyncButton>
    )
}

export default AqButton
