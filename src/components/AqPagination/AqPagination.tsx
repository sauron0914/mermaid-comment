import ReactPagination, { PaginationProps } from '@livelybone/react-pagination'
import React, { useLayoutEffect, useRef } from 'react'
import './AqPagination.scss'

export type AqPaginationProps = Pick<
    PaginationProps,
    Exclude<keyof PaginationProps, 'currentPageNumber'>
> & {
    currentPage?: number
}

const AqPagination: React.FC<AqPaginationProps> = ({
    children,
    currentPage,
    inputConfig,
    ...rest
}) => {
    const pagination = useRef<ReactPagination>(null)
    const $inputConfig =
        inputConfig || ({ enabled: false } as PaginationProps['inputConfig'])

    useLayoutEffect(() => {
        pagination.current!.setPageNumber(currentPage || 1)
    }, [currentPage])

    return (
        <ReactPagination
            {...rest}
            inputConfig={$inputConfig}
            ref={pagination}
        />
    )
}

export default AqPagination
