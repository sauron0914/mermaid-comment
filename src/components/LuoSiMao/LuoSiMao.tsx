import { ReactLuoSiMao } from '@auraxy/react-luosimao'
import React from 'react'
import './LuoSiMao.scss'

interface LuoSiMaoProps {
    onChange(captcha: string): void
}

const LuoSiMao: React.FC<LuoSiMaoProps> = ({ onChange }) => {
    return (
        <ReactLuoSiMao
            siteKey={
                window.location.hostname.endsWith('qianyingtax.com')
                    ? '4179959eab2055f99d759989434ba8f2'
                    : window.location.hostname.endsWith('qianyingtax.cn')
                    ? '420d544dbe6dc0dac321eed22f5cb75b'
                    : '6949f4741ed7f1f449236a091befa93f'
            }
            onChange={onChange}
        />
    )
}

export default LuoSiMao
