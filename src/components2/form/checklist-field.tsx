import type { CheckListProps, SearchBarProps, SelectorOption } from 'antd-mobile'
import type { PropsWithChildren } from 'react'
import type { FormControllerProps } from './controller'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { CheckList, Button, Popup, SearchBar } from 'antd-mobile'
import { pick, omit } from 'lodash'
import classnames from 'classnames'
import { IconSVG } from '../../components/icon-svg'
import { controllerPropKeys, FormController } from './controller'
import { ErrorBlock } from '../error-block'

export type CheckValue = string | number

type CheckListFieldProps<T extends FieldValues> = Omit<FormControllerProps<T>, 'render'>
  & Pick<SearchBarProps, 'onSearch' | 'onClear'>
  & Omit<CheckListProps, 'onChange'>
  & {
    placeholder?: string
    popupTitle?: string
    showSearch?: boolean
    options: SelectorOption<CheckValue>[]
    emptyMsg?: string
    fullPage?: boolean
    popupBodyClassName?: string
    countHeaderRender?: (count: number) => React.ReactNode
    onChange?: (value: CheckValue[], methods: UseFormReturn<FieldValues>) => void
  }

export const CheckListField = <
  T extends FieldValues = FieldValues,
>(props: PropsWithChildren<CheckListFieldProps<T>>) => {
  const controllerProps = pick(props, controllerPropKeys)
  const fieldPropsKeys = ['placeholder', 'popupTitle', 'showSearch', 'options', 'emptyMsg', 'countHeaderRender', 'onChange']
  const checkListProps = omit(props, [...controllerPropKeys, ...fieldPropsKeys])
  const methods = useFormContext()
  const {
    placeholder = '请选择',
    popupTitle,
    showSearch = true,
    options = [],
    emptyMsg = '暂无数据',
    fullPage = false,
    popupBodyClassName,
    countHeaderRender,
  } = props

  const fieldValue = methods.getValues(props.name)
  const [visible, setVisible] = useState<boolean>(false)
  const [checkedValue, setCheckedValue] = useState<CheckValue[]>(fieldValue)
  const [tempOptions, setTempOptions] = useState(options)

  const onSearch = (val: string) => {
    if (props.onSearch) {
      props.onSearch(val)
    } else {
      setTempOptions(tempOptions.filter(option => (option?.label as string).indexOf(val) !== -1))
    }
  }

  const onClear = () => {
    props.onClear?.()
    setTempOptions(options)
  }

  const onConfirm = (onFieldChange) => {
    onFieldChange(checkedValue)
    methods.trigger(props.name)
    props.onChange?.(checkedValue, methods)
    setVisible(false)
  }

  useEffect(() => {
    if (options && options.length > 0) {
      setTempOptions(options)
    }
  }, [options])

  return (
    <FormController
      onClick={() => {
        setVisible(true)
        setTempOptions(options)
      }}
      {...controllerProps}
      render={({
        onChange,
        value,
      }) => (
        <>
          <div className="flex justify-between text-base">
            {
              (options.filter(option => value?.includes(String(option.value)))
                .map(({ label }) => label)
                .join('、')) ||
                  <span className="text-[#B0B0B0]">{placeholder}</span>
            }
            <IconSVG className="shrink-0" symbol="icon-xianxing_you" />
          </div>
          <Popup
            bodyClassName={classnames('max-h-full', fullPage ? 'h-screen' : 'h-[65vh]', popupBodyClassName)}
            position="bottom"
            showCloseButton
            closeOnMaskClick
            destroyOnClose
            visible={visible}
            onClose={() => {
              setVisible(false)
            }}
          >
            <div className="py-[12px] text-base text-center bg-zinc-50 mb-px">{popupTitle || '请选择'}</div>
            {showSearch && (
              <SearchBar
                className="m-2"
                placeholder="点击输入关键词搜索"
                onSearch={onSearch}
                onClear={onClear}
              />
            )}
            <div className="h-[calc(100%-97px-55px)]">
              {
                tempOptions && tempOptions.length > 0
                  ? <>
                    {
                      countHeaderRender && (
                        <div className="bg-[#fafafa] text-xs text-gray-500 flex justify-between py-[8px] px-[12px]">
                          {countHeaderRender(tempOptions.length)}
                        </div>
                      )
                    }
                    <CheckList
                      className={classnames(countHeaderRender ? 'h-[calc(100%-32px)]' : 'h-full', 'overflow-scroll')}
                      defaultValue={value}
                      onChange={val => setCheckedValue(val)}
                      extra={active => (active ? <IconSVG symbol="icon-mianxing_zhengque" /> : <IconSVG className="text-[#B0B0B0]" symbol="icon-xianxing_kexuan" />)}
                      {...checkListProps}
                    >
                      {
                        tempOptions.map((item, index) => {
                          const { label, value } = item
                          return (
                            <CheckList.Item key={index} value={String(value)}>
                              {label}
                            </CheckList.Item>
                          )
                        })
                      }
                    </CheckList>
                    <div className="flex w-full fixed left-0 bottom-0 gap-2 p-2 shadow-inner">
                      <Button block color="primary" onClick={() => onConfirm(onChange)}>确定</Button>
                    </div>
                  </>
                  : <div className="h-full flex justify-center items-center text-center">
                    <ErrorBlock className="" status="empty" title={emptyMsg} description={null} />
                  </div>
              }
            </div>
          </Popup>
        </>
      )}
    />
  )
}
