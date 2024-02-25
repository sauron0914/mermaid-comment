import ReactLoading from '@auraxy/react-loading'
import AqPagination, {
    AqPaginationProps,
} from '@components/AqPagination/AqPagination'
import Toast from '@components/Toast/Toast'
import { useMounted } from '@utils/CustomHooks'
import classNames from 'classnames'
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import './AqQueryList.scss'

export interface AqQueryRef {
    query(reset?: boolean): any
}

interface AqQueryListProps {
    paginationProps?: AqPaginationProps
    className?: string
    children?: React.ReactNode
    queryAtMounted?: boolean

    onQuery(pageInfo: Required<PageParams>): Promise<any>
}

const inputConfig = {
    enable: false,
    text: '',
}

function initPageParams(paginationProps: AqPaginationProps) {
    return {
        currentPage: 1,
        inputConfig,
        ...paginationProps,
    }
}

const AqQueryList = forwardRef<AqQueryRef, AqQueryListProps>(
    (
        {
            children,
            className,
            paginationProps = { pageSize: 10 },
            onQuery,
            queryAtMounted = true,
        },
        ref,
    ) => {
        const $paginationProps = useRef(initPageParams(paginationProps))
        const [loading, setLoading] = useState(false)

        const query = useCallback(
            (currentPage: number = $paginationProps.current.currentPage) => {
                $paginationProps.current.currentPage = currentPage
                if (onQuery) {
                    setLoading(true)
                    onQuery({ currentPage, pageSize: paginationProps.pageSize })
                        .then((res: PageResult<any>) => {
                            $paginationProps.current.pageCount = res.pageCount
                            setLoading(false)
                        })
                        .catch(Toast.error)
                }
            },
            [onQuery, paginationProps.pageSize],
        )

        useImperativeHandle(ref, () => ({
            query: (reset: boolean) => {
                query(reset ? 1 : undefined)
            },
        }))

        const onPageChange = useCallback(
            (pageNumber: number) => {
                query(pageNumber)
                if ($paginationProps.current.onPageChange)
                    $paginationProps.current.onPageChange(pageNumber)
            },
            [query],
        )

        useMounted(() => {
            if (queryAtMounted) query()
        })

        return (
            <>
                <div className={classNames('aq-query-list-content', className)}>
                    {children}
                    {loading && (
                        <div className="loading-mask">
                            <ReactLoading />
                        </div>
                    )}
                </div>
                <AqPagination
                    {...$paginationProps.current}
                    onPageChange={onPageChange}
                />
            </>
        )
    },
)

export default AqQueryList
