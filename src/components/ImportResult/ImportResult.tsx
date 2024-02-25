import React, { ReactNode } from 'react'
import SvgTag from '@components/SvgTag/SvgTag'
import AqButton from '@components/AqButton/AqButton'
import classnames from 'classnames'
import './ImportResult.scss'
import { ImportErrorItem } from '@/api/types/Payee.type'
import AqTable from '../AqTable/AqTable'

interface IImportResult {
    errorStatusDesc?: string
    resultDesc?: string
    errorList: ImportErrorItem[]
    download?: string
    onDownload?: () => void
    continueUploading?: string
    onContinueUploading?(...args: any[]): any
}

const Columns: () => {
    th: ReactNode
    td: (item: ImportErrorItem) => ReactNode
}[] = () => [
    {
        th: '错误行',
        td: item => item.lineNo,
    },
    {
        th: '劳动者姓名',
        td: item => item.name,
    },
    {
        th: '劳动者身份证号',
        td: item => item.idCardNo,
    },
    {
        th: '联系手机号',
        td: item => item.phone,
    },
    {
        th: '错误原因',
        td: item => item.reason,
    },
]

const ImportResult: React.FC<IImportResult> = ({
    errorStatusDesc,
    resultDesc,
    errorList,
    download,
    onDownload,
    continueUploading,
    onContinueUploading,
}) => {
    const columns = [...Columns()]
    return (
        <div className="import-result">
            {errorStatusDesc && (
                <div className="import-result-error-title">
                    <SvgTag
                        svgName="icon-close"
                        className="import-result-error-title-icon"
                    />
                    {errorStatusDesc}
                </div>
            )}
            {resultDesc && <p className="import-result-desc">{resultDesc}</p>}
            <AqTable columns={columns} data={errorList} />
            <div className="import-result-handle">
                {download && (
                    <AqButton
                        onClick={onDownload}
                        className={classnames(
                            'download-error',
                            continueUploading ? '' : 'download-error-fill',
                            'fill-main',
                        )}
                    >
                        {download}
                    </AqButton>
                )}
                {continueUploading && (
                    <AqButton
                        onClick={onContinueUploading}
                        className="fill-main"
                        fill
                    >
                        {continueUploading}
                    </AqButton>
                )}
            </div>
        </div>
    )
}

export default ImportResult
