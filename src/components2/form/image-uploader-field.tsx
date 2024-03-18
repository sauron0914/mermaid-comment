import type { PropsWithChildren } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { FormControllerProps } from './controller'

import { useRef } from 'react'
import { Toast, ImageViewer } from 'antd-mobile'
import { useFormContext } from 'react-hook-form'
import { pick } from 'lodash'
import { controllerPropKeys, FormController } from './controller'
import { IconSVG } from '../icon-svg'
import { uploadImages } from '@dian/bridge'

type BridgeUploadOptions = {
  maxCount?: number;
  supportOriginal?: boolean;
  onlyCamera?: boolean;
  watermarkEnable?: boolean;
  watermarkInfo?: {
      lineOne: string;
      lineTwo: string;
      lineThree: string;
  };
  watermarkType?: number;
  greenCheck?: boolean;
}

type ImageUploaderFieldProps<T extends FieldValues> = Omit<FormControllerProps<T>, 'render' |'onClick'>
  & BridgeUploadOptions
  & {
    onChange?: (value: string, methods: UseFormReturn<FieldValues>) => void
    limit?: number
  }

const uploadImageOptions = [
  'maxCount',
  'supportOriginal',
  'onlyCamera',
  'watermarkEnable',
  'watermarkInfo',
  'watermarkType',
  'greenCheck',
]

export const ImageUploaderField = <
  T extends FieldValues = FieldValues,
>(props: PropsWithChildren<ImageUploaderFieldProps<T>>) => {
  const controllerProps = pick(props, controllerPropKeys)
  const bridgeUploadProps = pick(props, uploadImageOptions)

  const methods = useFormContext()
  const {
    name,
    maxCount = 9,
    limit = 9,
  } = props
  const tempImages = useRef<string[]>(methods.getValues(name) ?? [])

  const invokeUpload = (fieldChange) => {
    uploadImages({
      maxCount,
      ...bridgeUploadProps,
    }, (res) => {
      if (
        !res.success ||
        res.error ||
        (res.data && res.data.length === 0)
      ) {
        return Toast.show('上传失败')
      }
      tempImages.current = [...tempImages.current, ...res.data]
      fieldChange(tempImages.current)
    })
  }

  const handlePreview = (index) => {
    ImageViewer.Multi.show({
      images: tempImages.current,
      defaultIndex: index,
    })
  }

  const handleDelete = (index, fieldChange) => {
    tempImages.current.splice(index, 1)
    fieldChange(tempImages.current)
  }

  return (
    <FormController<T>
      {...controllerProps}
      render={({
        value,
        onChange,
      }) => (
        <div className="flex flex-wrap mt-2">
          {
            value?.length > 0
              ? value.map((url, index) => {
                return (
                  <div
                    key={index}
                    className="relative mr-3 mb-3"
                  >
                    <div
                      className="w-20 h-20 bg-cover"
                      style={{ backgroundImage: `url(${url.split(':')[1]})` }}
                      onClick={() => handlePreview(index)}
                    />
                    <div
                      className="w-4 h-4 rounded-full bg-black/[0.3] flex justify-center items-center absolute -right-2 -top-2"
                      onClick={() => handleDelete(index, onChange)}
                    >
                      <IconSVG symbol="icon-xianxing_guanbi" color="white" className="w-3 h-3" />
                    </div>
                  </div>
                )
              })
              : null
          }
          {
            (value?.length ?? 0) < limit && (
              <div
                className="w-20 h-20 bg-neutral-100 border border-dashed border-[#e8e8e8] rounded flex justify-center items-center"
                onClick={() => invokeUpload(onChange)}
              >
                <IconSVG symbol="icon-xianxing_zhaoxiangji" />
              </div>
            )
          }
        </div>
      )}
    />
  )
}
