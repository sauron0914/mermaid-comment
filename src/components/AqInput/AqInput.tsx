import SvgTag from '@components/SvgTag/SvgTag'
import Input, { InputProps } from '@livelybone/react-input'
import { getWithoutProperties } from '@utils/Object'
import classNames from 'classnames'
import React, { CSSProperties } from 'react'
import './AqInput.scss'

export enum IconPosition {
    left = 'left',
    right = 'right',
}

interface IconInfo {
    name: string
    /** 默认值：IconPosition.left */
    position?: IconPosition
    isTxt?: boolean
}

export interface AqInputProps extends InputProps {
    className?: string
    style?: CSSProperties
    /** 设置 input/textarea element 的样式类，当 icons 存在时有用 */
    inputClassName?: string
    label?: string
    errorText?: string
    icons?: IconInfo[]
    pristine?: boolean
    valid?: boolean
}

const AqInput: React.FC<AqInputProps> = ({
    label,
    errorText,
    icons,
    pristine,
    valid,
    style,
    className,
    inputClassName,
    ...rest
}) => {
    return (
        <div
            className={classNames('aq-input', className, {
                'has-error': errorText,
            })}
            style={style}
        >
            {label && (
                <label className="label" htmlFor={rest.id}>
                    {label}
                </label>
            )}
            {icons &&
                icons.map((icon, i) => {
                    const $className = classNames(
                        'icon',
                        icon.position || IconPosition.left,
                    )
                    return icon.isTxt ? (
                        <span className={$className} key={i}>
                            {icon.name}
                        </span>
                    ) : (
                        <SvgTag
                            className={$className}
                            svgName={icon.name}
                            key={i}
                        />
                    )
                })}
            <Input
                {...getWithoutProperties(rest, [
                    'validator',
                    'formatter',
                ] as any)}
                className={classNames('input', inputClassName)}
            />
            {!pristine && errorText && (
                <span className="error-text" title={errorText}>
                    {errorText}
                </span>
            )}
        </div>
    )
}

export default AqInput
