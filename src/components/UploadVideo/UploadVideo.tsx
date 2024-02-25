import React, { useRef, ReactNode } from 'react'
import './UploadVideo.scss'
import Toast from '../Toast/Toast'
import SvgTag from '../SvgTag/SvgTag'
import useStateTrackProp from 'use-state-track-prop'

export type TypeHandle = 'detail' | 'add' | 'edit'

interface UploadVideoParams {
    onChange?: (file: File) => void
    type: TypeHandle
    value?: any
    url?: string
    maxSize?: number
    placeholder?: string
    accept?: string
    desc?: ReactNode
    forceUpload?: boolean //可以强制上传
}

const UploadVideo: React.FC<UploadVideoParams> = ({
    onChange,
    type,
    value,
    url,
    placeholder,
    desc,
    accept,
    maxSize = 30,
    forceUpload,
}) => {
    const [$type, setType] = useStateTrackProp<TypeHandle>(type)
    const [fileName, setFileName] = useStateTrackProp<any>(
        (value && value.name) || value.name || '',
    )
    const InputRef = useRef<any>()
    const $maxSize = 1024 * 1024 * maxSize
    const onFileChange = () => {
        if (!InputRef.current) return
        const $file = InputRef.current!.files[0]
        if (!$file) return
        if ($file.size > $maxSize) {
            Toast.error('上传文件过大')
            return
        }
        setType('edit')
        setFileName($file.lastModified)
        onChange && onChange($file)
    }
    return (
        <div className="upload-video">
            <div className="upload">
                {$type === 'add' && (
                    <span className="upload-add">
                        <SvgTag svgName="icon-upload" /> {placeholder}
                        <input
                            type="file"
                            ref={InputRef}
                            accept={accept}
                            onChange={onFileChange}
                        />
                    </span>
                )}
                {$type === 'edit' && (
                    <p className="upload-edit" data-id={fileName}>
                        {fileName}
                        <span>
                            上传
                            <input
                                type="file"
                                ref={InputRef}
                                accept={accept}
                                onChange={onFileChange}
                            />
                        </span>
                    </p>
                )}
                {$type === 'detail' && (
                    <p className="upload-detail">
                        {(url ? (
                            <>
                                <a target="view_window" href={url}>
                                    {fileName}
                                </a>
                                {forceUpload && (
                                    <SvgTag
                                        onClick={() =>
                                            forceUpload && setType('edit')
                                        }
                                        svgName="icon-edit"
                                    />
                                )}
                            </>
                        ) : (
                            fileName
                        )) || (
                            <span
                                className="no-upload"
                                onClick={() => forceUpload && setType('edit')}
                            >
                                暂未上传
                                {forceUpload && <SvgTag svgName="icon-edit" />}
                            </span>
                        )}
                    </p>
                )}
            </div>
            {$type === 'add' && desc && <div className="desc">{desc}</div>}
        </div>
    )
}

export default UploadVideo
