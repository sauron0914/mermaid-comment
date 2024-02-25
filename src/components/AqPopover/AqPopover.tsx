import React, {
    ReactNode,
    useState,
    useImperativeHandle,
    forwardRef,
} from 'react'
import classNames from 'classnames'
import './AqPopover.scss'

interface IAqPopover {
    children?: ReactNode
    className?: string
    content: ReactNode
    onHide?: () => void
    onEnter?: () => void
    onLeave?: () => void
}

export interface IAqPopoverRef {
    hide(): void
}

const AqPopover = forwardRef<IAqPopoverRef, IAqPopover>(
    (
        { children, content, className, onLeave, onEnter, onHide, ...rest },
        ref,
    ) => {
        const [floatVisible, setFloatVisible] = useState<boolean>(false)
        const onMouseOver = () => {
            setFloatVisible(true)
            onEnter && onEnter()
        }
        const onMouseLeave = () => {
            setFloatVisible(false)
            onLeave && onLeave()
        }

        useImperativeHandle(ref, () => ({
            hide: () => {
                setFloatVisible(false)
            },
        }))

        return (
            <span
                {...rest}
                onMouseLeave={onMouseLeave}
                className={classNames('aq-popover', className)}
            >
                <span className="aq-popover-base" onMouseOver={onMouseOver}>
                    {children}
                    {floatVisible && (
                        <span className="aq-popover-float-box">
                            <span className="aq-popover-float">{content}</span>
                        </span>
                    )}
                </span>
            </span>
        )
    },
)

export default AqPopover
