import emojiRegex from 'emoji-regex'

// 手机号
export const isMobilePhone = mobile => /^1[3-9](\d{9})$/.test(mobile)

// 身份证号
export const isIDNumber = id => /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(id)

// emoji
export const isEmoji = (val) => {
  const reg = emojiRegex()
  return val ? reg.test(val) : reg
}
