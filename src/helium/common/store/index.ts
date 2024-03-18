/**
 * @fileoverview 应用的全局状态（基于context）
 * @author 唯刃<weiren.dian.so>
 */
import { createContainer } from 'unstated-next'

function useGlobalContainer () {
  return {

  }
}

export const GlobalContainer = createContainer(useGlobalContainer)
