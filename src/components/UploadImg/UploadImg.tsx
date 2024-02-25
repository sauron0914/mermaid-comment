import React, { useState, useRef, useEffect, ReactNode } from 'react'
import './UploadImg.scss'
import Toast from '../Toast/Toast'

interface UploadImgParams {
    canUpload: boolean
    value?: string
    imgWidth?: string
    imgHeight?: string
    desc?: ReactNode
    maxSize?: number
    accept?: string
    onChange?: (file: File) => void
}

const UploadImg: React.FC<UploadImgParams> = ({
    canUpload,
    value,
    imgWidth = '140px',
    imgHeight = '140px',
    desc = '暂无图片',
    maxSize = 30,
    accept = 'image/*, application/pdf',
    onChange,
}) => {
    const $maxSize = 1024 * 1024 * maxSize
    const [$value, setValue] = useState<any>(value || '')
    const InputRef = useRef<any>()
    const onFileChange = () => {
        if (!InputRef.current) return
        const $file = InputRef.current!.files[0]
        if (!$file) return
        if ($file.size > $maxSize) {
            Toast.error('上传文件过大')
            return
        }
        var reader = new FileReader()
        reader.readAsDataURL($file)
        reader.onload = function() {
            setValue(reader.result as string)
            onChange && onChange($file)
        }
    }
    useEffect(() => {
        if (typeof value === 'object') {
            var reader = new FileReader()
            reader.readAsDataURL(value as File)
            reader.onload = function() {
                setValue(reader.result)
            }
        }
    }, [value])
    return (
        <div className="upload-img">
            {$value || value ? (
                <img
                    width={imgWidth}
                    height={imgHeight}
                    src={$value || value}
                    alt=""
                />
            ) : (
                <span
                    className="no-img"
                    style={{
                        width: imgWidth,
                        height: imgHeight,
                    }}
                >
                    <em>+</em>
                    {desc}
                </span>
            )}
            {canUpload && (
                <input
                    ref={InputRef}
                    type="file"
                    accept={accept}
                    onChange={onFileChange}
                />
            )}
        </div>
    )
}

export default UploadImg
