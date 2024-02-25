import React, {
    ChangeEvent,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react'
import SvgTag from '@components/SvgTag/SvgTag'
import AqButton from '@components/AqButton/AqButton'
import classNames from 'classnames'
import './ImportFile.scss'
import customConnect, { DefaultProps } from '@/store/custom-connect'
import { withRouter } from 'react-router'
import { useAgentState } from '@/store/models/user'
import AqSelect from '../AqSelect/AqSelect'

interface IImportFile extends DefaultProps {
    title: string
    desc?: string
    onImport(file: File, agentId: string): any
    templateUrl: string
}

export function useImportFile(
    onImport: IImportFile['onImport'],
    agentId: string,
) {
    const fileRef = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState<string>('')

    const importFile = useCallback(() => {
        const $file = fileRef.current!.files && fileRef.current!.files[0]
        if (!(fileRef.current && $file)) {
            return Promise.reject('请选择文件！')
        }
        return onImport($file, agentId)
    }, [agentId, onImport])

    const fileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        setFileName(files && files[0] ? files[0].name : '')
    }, [])

    const clearFile = useCallback(() => {
        setFileName('')
        if (fileRef.current) fileRef.current.value = ''
    }, [])

    return useMemo(
        () => ({
            fileRef,
            fileName,
            importFile,
            fileChange,
            clearFile,
        }),
        [clearFile, fileChange, fileName, importFile],
    )
}

const ImportFile: React.FC<IImportFile> = ({
    title,
    desc,
    onImport,
    templateUrl,
    agentList,
}) => {
    const [agentValue, setAgentValue, $agentList] = useAgentState(agentList)
    const [_agentList, setAgentList] = useState($agentList)
    const {
        fileRef,
        fileName,
        fileChange,
        importFile,
        clearFile,
    } = useImportFile(onImport, agentValue)
    return (
        <div className="import-file">
            {_agentList.length > 1 && (
                <AqSelect
                    className="agent-select-import"
                    value={agentValue}
                    placeholder="请选择代理平台"
                    options={_agentList}
                    onChange={(val: string) => {
                        setAgentValue(val)
                    }}
                    onSearch={e => {
                        setAgentList(
                            agentList.filter((item: any) =>
                                item.label.includes(e.target.value),
                            ),
                        )
                    }}
                />
            )}
            <p>{title}</p>
            {desc && <p className="import-file-desc">{desc}</p>}
            <div className="import-file-choose">
                <p className="import-file-upload">
                    <span>
                        <SvgTag
                            className="import-file-upload-svg"
                            svgName="icon-upload"
                        />
                        <i>选择文件</i>
                        <input
                            ref={fileRef}
                            type="file"
                            onChange={fileChange}
                            accept=".xls,.xlsx"
                        />
                    </span>
                    {templateUrl && (
                        <a
                            href={templateUrl}
                            download={`爱完税批量添加劳动者信息录入模板.xlsx`}
                        >
                            下载模版
                        </a>
                    )}
                </p>
                <p className="import-file-show">
                    {fileName && (
                        <>
                            <span>{fileName}</span>
                            <SvgTag
                                onClick={clearFile}
                                className="import-file-del-svg"
                                svgName="icon-delete"
                            />
                        </>
                    )}
                </p>
            </div>
            <div className="import-file-handle">
                <AqButton
                    fill={true}
                    className={classNames(
                        'import-file-button',
                        fileName ? '' : 'involid',
                        'fill-main',
                    )}
                    onClick={importFile}
                >
                    导 入
                </AqButton>
            </div>
        </div>
    )
}

export default customConnect()(withRouter(ImportFile))
