import { BLS, zApi, dayjs } from '@dian/app-utils'
import {
  handlePageScanCode, handleScanInventory,
} from '@dian/app-utils/bridge'
import { href } from '@dian/app-utils/href'
import { useRouter } from '@dian/app-utils/router'
import { createVistor } from '@dian/bridge'
import { Toast } from 'antd-mobile'
import raf from 'rc-util/lib/raf'
import { useRef } from 'react'

export function isWindow (obj: any): obj is Window {
  return obj !== null && obj !== undefined && obj === obj.window
}

export function getScroll (
  target: HTMLElement | Window | Document | null,
  top: boolean,
): number {
  if (typeof window === 'undefined') {
    return 0
  }
  const method = top ? 'scrollTop' : 'scrollLeft'
  let result = 0
  if (isWindow(target)) {
    result = target[top ? 'pageYOffset' : 'pageXOffset']
  } else if (target instanceof Document) {
    result = target.documentElement[method]
  } else if (target instanceof HTMLElement) {
    result = target[method]
  } else if (target) {
    // According to the type inference, the `target` is `never` type.
    // Since we configured the loose mode type checking, and supports mocking the target with such shape below::
    //    `{ documentElement: { scrollLeft: 200, scrollTop: 400 } }`,
    //    the program may falls into this branch.
    // Check the corresponding tests for details. Don't sure what is the real scenario this happens.
    result = target[method]
  }

  if (target && !isWindow(target) && typeof result !== 'number') {
    result = (target.ownerDocument ?? target).documentElement?.[method]
  }
  return result
}

export function easeInOutCubic (t: number, b: number, c: number, d: number) {
  const cc = c - b
  t /= d / 2
  if (t < 1) {
    return (cc / 2) * t * t * t + b
  }

  return (cc / 2) * ((t -= 2) * t * t + 2) + b
}

interface ScrollToOptions {
  /** Scroll container, default as window */
  getContainer?: () => HTMLElement | Window | Document;
  /** Scroll end callback */
  callback?: () => void;
  /** Animation duration, default as 450 */
  duration?: number;
}

export function scrollTo (y: number, options: ScrollToOptions = {}) {
  const { getContainer = () => window, callback, duration = 450 } = options
  const container = getContainer()
  const scrollTop = getScroll(container, true)
  const startTime = Date.now()

  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollTop = easeInOutCubic(
      time > duration ? duration : time,
      scrollTop,
      y,
      duration,
    )
    if (isWindow(container)) {
      (container as Window).scrollTo(window.pageXOffset, nextScrollTop)
    } else if (
      container instanceof Document ||
      container.constructor.name === 'HTMLDocument'
    ) {
      (container as Document).documentElement.scrollTop = nextScrollTop
    } else {
      (container as HTMLElement).scrollTop = nextScrollTop
    }
    if (time < duration) {
      raf(frameFunc)
    } else if (typeof callback === 'function') {
      callback()
    }
  }
  raf(frameFunc)
}

export const useAccessURL = (url: string) => {
  const { navigator } = useRouter()

  const forward = useRef(() => {
    if (!url) return
    Toast.show('工具配置有误')
  })

  if (url.startsWith('href')) {
    // href
    const [, app, path] = url.split('::')
    forward.current = () => href(app, path)
  } else if (url.startsWith('across')) {
    // across
    const [, app, path] = url.split('::')
    if (app === 'lithium' && path === '/leads/list') {
      // 我的粒子
      forward.current = () =>
        zApi.get('/nile/api/v1/leads/permission').then((res) => {
          if (res) {
            navigator.across(app, path)
          } else {
            Toast.show('公测阶段，仅对受邀用户开放')
          }
        })
    } else if (app === 'beryllium' && path === '/chargingStation/create') {
      forward.current = () => {
        const bls = new BLS({ namespace: 'beryllium' })
        bls.set('createStationMerchant', {}, {})
        navigator.across(app, path)
      }
    } else if (app === 'beryllium' && path === '/chargingStation/bindDevice/deviceInfo') {
      forward.current = () => {
        const bls = new BLS({ namespace: 'beryllium' })
        bls.set('stationForBindDevice', {}, {})
        navigator.across(app, path)
      }
    } else {
      forward.current = () => navigator.across(app, path)
    }
  } else if (url.startsWith('action')) {
    const [, bridge, biz] = url.split('::')
    // 扫码
    if (bridge === 'scan' && biz === 'device') {
      // 设备扫一扫
      forward.current = () => handlePageScanCode()
    } else if (bridge === 'scan' && biz === 'inventory') {
      // 扫码盘点
      forward.current = () => handleScanInventory()
    } else if (bridge === 'visitor') {
      // 拜访管理
      forward.current = () => createVistor()
    }
  } else {
    // 应用内跳转
    forward.current = () => navigator.navigate(url)
  }

  return forward.current
}

export const isSameWeek = (timeStr: string) => {
// 获取当前日期
  const currentDate = dayjs()

  // 获取本周的开始日期
  const startOfWeek = currentDate.startOf('week')

  // 获取本周的结束日期
  const endOfWeek = currentDate.endOf('week')

  // 要检查的日期
  const dateToCheck = dayjs(timeStr)// 你可以替换成你想检查的日期

  // 判断日期是否在本周内
  const isInCurrentWeek = dateToCheck.isAfter(startOfWeek) && dateToCheck.isBefore(endOfWeek)

  return isInCurrentWeek
}
