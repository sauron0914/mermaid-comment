import SvgTag from '@components/SvgTag/SvgTag'
import useStateTrackProp from 'use-state-track-prop'
import classNames from 'classnames'
import React, { useCallback, useMemo, useState } from 'react'
import './AqCheckBox.scss'

export enum CheckBoxValue {
    Checked = 1,
    Partial,
    Unchecked,
}

const CheckBoxValueRef = {
    [CheckBoxValue.Checked]: { className: 'checked', icon: 'icon-checked' },
    [CheckBoxValue.Partial]: {
        className: 'partial',
        icon: 'icon-partial-checked',
    },
    [CheckBoxValue.Unchecked]: { className: '', icon: 'icon-unchecked' },
}

interface AqCheckBoxProps {
    value?: CheckBoxValue
    className?: string

    onChange?(value: CheckBoxValue): void
}

const AqCheckBox: React.FC<AqCheckBoxProps> = ({
    value,
    className,
    onChange,
}) => {
    const [$value, setValue] = useStateTrackProp(
        value || CheckBoxValue.Unchecked,
    )

    const onClick = useCallback(() => {
        setValue(preValue => {
            const v =
                preValue !== CheckBoxValue.Unchecked
                    ? CheckBoxValue.Unchecked
                    : CheckBoxValue.Checked
            if (onChange) onChange(v)
            return v
        })
    }, [onChange, setValue])

    return (
        <div
            className={classNames(
                'aq-check-box',
                className,
                CheckBoxValueRef[$value].className,
            )}
            onClick={onClick}
        >
            <SvgTag svgName={CheckBoxValueRef[$value].icon} />
        </div>
    )
}

export default AqCheckBox

/**
 * 第一个元素控制全部行的选中
 * */
type TableCheckboxOnCheck = (i: number, value: CheckBoxValue) => void

export function useTableCheckBox(
    length: number,
): {
    checkedArr: CheckBoxValue[]
    onChange: TableCheckboxOnCheck
    init: (length?: number) => void
} {
    const [checkedArr, setChecked] = useState([] as CheckBoxValue[])

    const onChange = useCallback(
        (i, value) => {
            setChecked(pre => {
                pre.length = length + 1
                const arr = [...pre]
                if (i !== 0) {
                    arr[i] = value
                    arr[0] = arr.every(
                        (val, i) => i === 0 || val === CheckBoxValue.Checked,
                    )
                        ? CheckBoxValue.Checked
                        : CheckBoxValue.Unchecked
                } else {
                    arr.forEach((v, i) => {
                        arr[i] = value
                    })
                }
                return arr
            })
        },
        [length],
    ) as TableCheckboxOnCheck

    const init = useCallback(
        (initLength: number = length) => {
            setChecked(
                [...Array(initLength + 1)].map(() => CheckBoxValue.Unchecked),
            )
        },
        [length],
    )

    return useMemo(() => ({ checkedArr, onChange, init }), [
        checkedArr,
        onChange,
        init,
    ])
}
