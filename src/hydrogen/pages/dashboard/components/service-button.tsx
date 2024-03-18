import { getNickName, getUserId } from '@/common/utils/cookie'
import { FloatingBubble } from 'antd-mobile'

function connectQiYu (extra) {
  const name = getNickName() || ''
  const userId = getUserId() || ''

  const url = 'https://m.dian.so/qiyu'

  window.location.href = `${url}?uid=${userId}&name=${name}&robotId=3412341&level=5&wp=1&robotShuntSwitch=1${extra || ''}`
}

export function ServiceButton () {
  const handleJumpUrl = () => {
    connectQiYu('&gid=483908581')
  }
  return (
    <div className="absolute z-10">
      <FloatingBubble
        axis="xy"
        magnetic="x"
        style={{
          '--initial-position-bottom': '80px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
          opacity: 0.8,
        }}
        onClick={handleJumpUrl}
      >
        <svg className="icon w-8 h-8" viewBox="0 0 1080 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="210.9375" height="200"><path d="M580.266667 136.533333H500.622222C341.333333 136.533333 210.488889 267.377778 210.488889 426.666667V682.666667c0 51.2 34.133333 96.711111 85.333333 113.777777v17.066667c0 62.577778 51.2 119.466667 119.466667 119.466667h125.155555c17.066667 0 34.133333-17.066667 34.133334-34.133334s-17.066667-34.133333-34.133334-34.133333H409.6c-28.444444 0-51.2-22.755556-51.2-51.2v-11.377778h34.133333c17.066667 0 34.133333-17.066667 34.133334-34.133333V557.511111c0-17.066667-17.066667-34.133333-34.133334-34.133333H273.066667V426.666667c0-125.155556 102.4-221.866667 221.866666-221.866667h85.333334c125.155556 0 221.866667 102.4 221.866666 221.866667v96.711111H682.666667c-17.066667 0-34.133333 17.066667-34.133334 34.133333v216.177778c0 17.066667 17.066667 34.133333 34.133334 34.133333h62.577777c62.577778 0 119.466667-51.2 119.466667-119.466666V426.666667c5.688889-159.288889-125.155556-290.133333-284.444444-290.133334z m-221.866667 449.422223v147.911111h-28.444444c-28.444444 0-51.2-22.755556-51.2-51.2v-96.711111h79.644444z m449.422222 11.377777V682.666667c0 28.444444-22.755556 51.2-51.2 51.2h-34.133333v-147.911111h85.333333v11.377777z" fill="#fff" /></svg>
      </FloatingBubble>
    </div>

  )
}
