import { useMounted } from '@utils/CustomHooks'
import React, { useState } from 'react'
import './AqDateRange.scss'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import SvgTag from '../SvgTag/SvgTag'
import { setRangeTime } from '@/common/utils/Format'
import classNames from 'classnames'
import { format } from 'date-fns'

interface AqDateRangeParams {
    startTime?: Date
    endTime?: Date
    arrowClear?: boolean
    onChangeDate: (start: string, end: string) => any
    className?: string
    formatDateStart?: string
    formatDateEnd?: string
    initEmpty?: boolean
}

const AqDateRange: React.FC<AqDateRangeParams> = ({
    startTime,
    endTime,
    onChangeDate,
    className,
    arrowClear = true,
    formatDateStart = 'yyyy-MM-dd 00:00:00',
    formatDateEnd = 'yyyy-MM-dd 23:59:59',
    initEmpty = false,
    ...rest
}) => {
    const [startDate, setStartDate] = useState<Date | null>(
        startTime || (initEmpty ? null : setRangeTime(new Date(), 30)),
    )
    const [endDate, setEndDate] = useState<Date | null>(
        endTime || (initEmpty ? null : new Date()),
    )

    useMounted(() => {
        onChangeDate(
            initEmpty
                ? ''
                : startDate
                ? `${format(startDate, formatDateStart)}`
                : '',
            initEmpty
                ? ''
                : endDate
                ? `${format(endDate!, formatDateEnd)}`
                : '',
        )
    })

    const setDate = (date: Date, type: 'start' | 'end') => {
        if (type === 'start') {
            setStartDate(date)
            onChangeDate(
                `${format(date, formatDateStart)}`,
                endDate ? `${format(endDate, formatDateEnd)}` : '',
            )
        } else {
            setEndDate(date)
            onChangeDate(
                startDate ? `${format(startDate, formatDateStart)}` : '',
                `${format(date, formatDateEnd)}`,
            )
        }
    }

    const clearDate = () => {
        setStartDate(null)
        setEndDate(null)
        onChangeDate('', '')
    }

    return (
        <div {...rest} className={classNames('aq-date-range', className)}>
            <SvgTag svgName="icon-calender" className="svg-calender" />
            <DatePicker
                selected={startDate}
                onChange={(date: Date) => setDate(date, 'start')}
                selectsStart
                placeholderText="开始时间"
                dateFormat="yyyy/MM/dd"
                startDate={startDate}
                endDate={endDate}
            />
            -
            <DatePicker
                selected={endDate}
                onChange={(date: Date) => setDate(date, 'end')}
                selectsEnd
                placeholderText="结束时间"
                dateFormat="yyyy/MM/dd"
                endDate={endDate}
                minDate={startDate}
            />
            {arrowClear && (
                <SvgTag
                    svgName="icon-close"
                    onClick={clearDate}
                    className="aq-date-range-close"
                />
            )}
        </div>
    )
}

export default AqDateRange
