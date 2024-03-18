import { getNickName, getUserId } from './cookie'

export function getWatermark () {
  return `${getNickName() || ''} ${getUserId() || ''}`
}
