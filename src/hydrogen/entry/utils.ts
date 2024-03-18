import { qiankunWindow } from '@dian/vite-plugin-qiankun/helper'

// 由主应用加载/独立运行
const isInSubapp = !!qiankunWindow.__POWERED_BY_QIANKUN__

// basename需要区分，否则主应用加载后刷新就变成了单独运行
export const basename = isInSubapp ? '/elements/hydrogen' : '/hydrogen'
