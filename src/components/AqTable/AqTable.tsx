import { ReactNode } from 'react'
import './AqTable.scss'

import {
    TableBase as AqTable,
    TableExtend as AqTableExtend,
} from '@auraxy/react-table'
import './AqTable.scss'

type ClassNameCalc = string | ((index: number) => string)

interface SpanInfo {
    colSpan?: number
    rowSpan?: number
}

export interface Column<T = any> {
    className?: ClassNameCalc
    th: ReactNode
    props?: SpanInfo & {
        width?: string | number
    }

    td(rowData: T, dataIndex: number, options: any, column: Column): ReactNode

    [key: string]: any

    [key: number]: any
}

export interface ColumnGenTF<T, K = any> {
    (...args: K[]): Column<T>[]
}

export { AqTableExtend }

export default AqTable

export * from '@auraxy/react-table'
