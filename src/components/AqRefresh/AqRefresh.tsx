import React, { useState } from 'react'
import './AqRefresh.scss'
import classnames from 'classnames'
import SvgTag from '../SvgTag/SvgTag'

interface AqRefreshParams {
    onRefresh: () => void
}

let timer: any

const AqRefresh: React.FC<AqRefreshParams> = ({ onRefresh }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const onClick = () => {
        setLoading(true)
        new Promise(resolve => {
            resolve(onRefresh())
        }).then(() => {
            timer = setTimeout(() => {
                setLoading(false)
                clearTimeout(timer)
            }, 500)
        })
    }
    return (
        <SvgTag
            svgName="icon-refresh"
            className={classnames(
                'icon-refresh',
                loading ? 'icon-refresh-play' : '',
            )}
            onClick={onClick}
        />
    )
}

export default AqRefresh
