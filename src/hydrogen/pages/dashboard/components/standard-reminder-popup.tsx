import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Divider, Button, Popup } from 'antd-mobile'
import classnames from 'classnames'
import { useInterval } from 'ahooks'
import { standardContent } from '../constants'
import { fetchStandardPopup, recordStandardPopup } from '../api'
import { useToastQuery, useToastMutation } from '@dian/common/hooks/react-query'
import { bls } from '@/common/utils/storage'
import { isSameWeek } from '../utils'

export const StandardReminderPopup = forwardRef(function Standard (
  props,
  ref,
) {
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false)
  const [count, setCount] = useState(0)
  const [running, setRunning] = useState(true)

  // 判断这一周有没有弹框
  const enabledFetch = isSameWeek(bls.get('standard_popup'))

  useInterval(
    () => {
      if (count > 1) {
        setCount(count - 1)
      } else {
        setRunning(false)
      }
    },
    running ? 1000 : undefined,
  )

  const { data } = useToastQuery({
    queryKey: ['fetchStandardPopup'],
    queryFn: () =>
      fetchStandardPopup({}),
    enabled: !enabledFetch,
    cacheTime: 5 * 60 * 1000,
  })

  const { data: recordStatus, mutate: fetchRecordStandardPopup } = useToastMutation({
    mutationFn: recordStandardPopup,
  })

  useEffect(() => {
    if (recordStatus) {
      const timeStr = new Date().getTime()
      bls.set('standard_popup', timeStr)
    }
  }, [recordStatus])

  useEffect(() => {
    if (data) {
      setVisiblePopup(true)
      setCount(15)
      // standardRef.current?.setVisiblePopup(true)
    }
  }, [data])

  useImperativeHandle(ref, () => ({ setVisiblePopup }))

  const handleRecordPopup = () => {
    fetchRecordStandardPopup({})
    setVisiblePopup(false)
  }

  return (
    <Popup
      visible={visiblePopup}
      // onMaskClick={() => {
      //   setVisiblePopup(false)
      // }}
      onClose={() => {
        setVisiblePopup(false)
      }}
      bodyStyle={{ height: '80vh' }}
    >
      <div className="p-4 h-[100%] bg-gray-300 flex flex-col">
        <div className="h-[74px]">
          <div className="text-gray-900 text-[28px] font-serif ">小电渠道商管理规范2.2</div>
          <div className="text-xs text-gray-700 my-2"><span className=" text-gray-800">适用范围：</span>小电所有渠道商、电小创公司</div>
        </div>

        <div className=" overflow-y-auto flex-1">
          {
            standardContent.map((item) => {
              return (
                <div className="bg-white p-4 rounded-xl mb-2" key={item.title}>
                  <div className={classnames('py-1 px-3 inline-block  mb-3 text-base', item.type === 'other' ? 'text-black' : 'bg-danger-600 rounded-lg text-white')}>{item.title}</div>
                  {
                  item.children.map((i, index) => {
                    return (
                      <div key={index}>
                        {i.subTitle && <div className="mb-3 text-gray-900 text-base">{i.subTitle}</div>}
                        {
                          i.clauseList.map((info, i) => {
                            return <div className="flex" key={i}><div className="border-2 border-gray-200 bg-white w-2 h-2 rounded mr-2 mt-[6px] flex-shrink-0" /><span className={classnames('text-sm  mb-2', info.color === 'red' ? 'text-danger-600' : 'text-grey-800')}>{info.text}</span></div>
                          })
                        }
                        {
                          item.children.length - 1 !== index && <Divider
                            style={{
                              borderColor: '#E8E8E8',
                              borderStyle: 'dashed',
                            }}
                          />
                        }

                      </div>
                    )
                  })
                }
                </div>
              )
            })
          }
        </div>
        <div className="h-[52px]"> <Button
          disabled={running} block color="primary" className="mt-2"
          onClick={handleRecordPopup}
        >我已经阅读并同意{
          running ? `(${count}s)` : ''
        }</Button></div>
      </div>
    </Popup>
  )
})
