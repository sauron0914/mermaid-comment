/**
 * @fileoverview 应用的全局状态（基于context）
 * @author 唯刃<weiren.dian.so>
 */
import { useState } from 'react'
import { createContainer } from 'unstated-next'

function useGlobalContainer (initialState = { watermark: '' }) {
  const [watermark, setWatermark] = useState(initialState.watermark)

  return { watermark, setWatermark }
}

export const GlobalContainer = createContainer(useGlobalContainer)
