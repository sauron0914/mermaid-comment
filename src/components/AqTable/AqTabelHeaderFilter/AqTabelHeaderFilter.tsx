import React, { ReactNode } from 'react'
import './AqTabelHeaderFilter.scss'
import AqSelect, { Option } from '../../AqSelect/AqSelect'
import useStateTrackProp from 'use-state-track-prop'

interface AqTabelHeaderFilterParams {
    label: ReactNode
    value?: string
    options: Option[]
    onChange: (item: any) => void
}

const AqTabelHeaderFilter: React.FC<AqTabelHeaderFilterParams> = ({
    label,
    value,
    options,
    onChange,
}) => {
    const [_options, setOptions] = useStateTrackProp(options)
    return (
        <div className="aq-table-header-filter">
            <p className="header-filter-title">{label}</p>
            <AqSelect
                className="header-agent-list"
                options={_options}
                value={value}
                onChange={val => {
                    onChange(val)
                }}
                onSearch={ev => {
                    setOptions(
                        options.filter(item => {
                            return (item.label as string)!.includes(
                                ev.target.value,
                            )
                        }),
                    )
                }}
            ></AqSelect>
        </div>
    )
}

export default AqTabelHeaderFilter
