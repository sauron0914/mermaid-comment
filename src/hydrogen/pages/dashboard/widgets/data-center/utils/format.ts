/** 指标卡数据转换函数
 * 测试数据
 * null
 * undefined
 * -1
 * '-1'
 * '-1^'
 * 7.823E5
 * @param {String | Number} value
 * @return {String}
 */

export function formatAmount (value, trans = true) {
  if (isFinite(value)) {
    const val = +value
    if (trans && (val > 99999 || val < -99999)) {
      const val2 = val / 10000
      if (val2 % 1 !== 0) {
        return `${val2.toFixed(2)}w`
      }

      return `${val2}w`
    }

    if (val % 1 !== 0) {
      return val.toFixed(2)
    }

    return val.toString()
  }

  if (typeof value === 'string') {
    if (value === '-' || value.trim() === '') {
      return '-'
    }
    // @ts-ignore: 先不动
    if (isFinite(value)) {
      return value
    }

    return value
  }

  return '-'
}

export function formatRate (value, fix = 2) {
  if (!value && value !== 0) {
    return '-'
  }

  if (isNaN(Number(value))) {
    return value
  }

  return `${(value * 100).toFixed(fix)}%`
}

export function toMoney (num) {
  if (num) {
    if (isNaN(num)) {
      alert('金额中含有不能识别的字符')
      return
    }
    num = typeof num == 'string' ? parseFloat(num) : num// 判断是否是字符串如果是字符串转成数字
    num = num.toFixed(2)// 保留两位
    num = parseFloat(num)// 转成数字
    num = num.toLocaleString()// 转成金额显示模式
    // 判断是否有小数
    if (num.indexOf('.') === -1) {
      num = `${num}.00`
    } else {
      num = num.split('.')[1].length < 2 ? `${num}0` : `${num}`
    }
    return num// 返回的是字符串23,245.12保留2位小数
  }
  return num
}
