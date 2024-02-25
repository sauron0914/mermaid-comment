import useStateTrackProp from 'use-state-track-prop'
import classNames from 'classnames'
import React, {
    forwardRef,
    ReactNode,
    useCallback,
    useImperativeHandle,
} from 'react'
import './AqTab.scss'

export interface TabItem {
    label: ReactNode
    value: string | number
}

export interface TabProps {
    options: TabItem[]
    value?: TabItem['value']
    className?: string

    onChange?(val: TabItem['value']): void
}

export interface TabRefProps {
    setValue(val: TabItem['value']): void
}

const AqTab = forwardRef<TabRefProps, TabProps>(
    ({ options, value, className, onChange }, ref) => {
        const [$value, setValue] = useStateTrackProp<TabItem['value']>(
            value || (options[0] && options[0].value),
        )

        const valueChange = useCallback(
            (val: TabItem['value']) => {
                setValue(val)
                if (onChange) onChange(val)
            },
            [onChange, setValue],
        )

        useImperativeHandle(ref, () => ({ setValue: valueChange }))

        return (
            <div className={classNames('aq-tab', className)}>
                {options.map(op => (
                    <div
                        className={classNames('tab-item', {
                            selected: op.value === $value,
                        })}
                        key={op.value}
                        onClick={valueChange.bind(null, op.value)}
                    >
                        {op.label}
                    </div>
                ))}
            </div>
        )
    },
)
export default AqTab
