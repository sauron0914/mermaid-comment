import { Tabs } from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { scrollTo, getScroll } from '../utils'
import { throttle } from '../utils/throttle'

function getDefaultContainer () {
  return window
}

function getOffsetTop (element: HTMLElement, container: HTMLElement | Window): number {
  if (!element.getClientRects().length) {
    return 0
  }
  const rect = element.getBoundingClientRect()
  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument!.documentElement!
      return rect.top - container.clientTop
    }
    return rect.top - (container as HTMLElement).getBoundingClientRect().top
  }

  return rect.top
}

interface Item {
  title: string
  id: string
}

interface AnchorProps {
  items?: Item[]
  getContainer?: ()=> HTMLElement
  offsetTop?: number
}

export const Anchor: React.FC<AnchorProps> = ({
  items = [],
  offsetTop = 0,
  getContainer,
}) => {
  const [currentLink, setCurrentLink] = useState('')
  const animating = useRef(false)
  const getCurrentContainer = getContainer ?? getDefaultContainer

  const getCurrentAnchor = () :Item => {
    const container = getCurrentContainer()

    const passedLinks: Item[] = []

    for (const item of items) {
      const target = document.getElementById(item.id)
      if (target) {
        const top = getOffsetTop(target, container)
        if (top < offsetTop) {
          passedLinks.push(item)
        }
      }
    }
    return passedLinks.at(-1) ?? items[0]
  }

  function handleScroll () {
    if (animating.current) {
      return
    }

    const currentAnchor = getCurrentAnchor()

    currentAnchor && setCurrentLink(currentAnchor.id)
  }

  function handleScrollTo (id:string) {
    setCurrentLink(id)
    const target = document.getElementById(id)
    if (!target) return

    const container = getCurrentContainer()
    const scrollTop = getScroll(container, true)
    const targetOffsetTop = getOffsetTop(target, container)
    const y = scrollTop + targetOffsetTop - offsetTop
    animating.current = true
    scrollTo(y, {
      getContainer: getCurrentContainer,
      callback () {
        animating.current = false
      },
    })
  }

  useEffect(() => {
    const scrollContainer = getCurrentContainer()
    handleScroll()

    const onScroll = throttle(handleScroll, 200)

    scrollContainer?.addEventListener('scroll', onScroll)
    return () => {
      scrollContainer?.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <Tabs
      className="border-b-0"
      style={{
        '--title-font-size': '12px',
        '--active-line-height': '1px',
        '--content-padding': '4px',
      }}
      activeKey={currentLink}
      onChange={handleScrollTo}
    >
      {
         items.map(item => <Tabs.Tab title={item.title} key={item.id} />)
      }
    </Tabs>
  )
}
