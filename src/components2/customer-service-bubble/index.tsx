import { FloatingBubble } from 'antd-mobile'
import { useRouter } from '../../hooks/use-router'
import { connectQiYu } from '../../utils/servicer'

export default function CustomerServiceBubble () {
  const { navigator } = useRouter()

  const handleJumpUrl = () => {
    navigator.href('global', {
      // @ts-ignore: 本场景出现类型错误
      pathname: connectQiYu('&gid=483908581&robotId=3412341'),
    })
  }
  return (
    <FloatingBubble
      axis="xy"
      magnetic="x"
      style={{
        '--initial-position-bottom': '80px',
        '--initial-position-right': '24px',
        '--edge-distance': '16px',
      }}
      onClick={handleJumpUrl}
      className="opacity-[0.9]"
    >
      <img className="w-[26px]" src="https://fed.dian.so/image/fef43437a9ee9fa00253e8814e95659d.png" />
    </FloatingBubble>
  )
}
