function isPhone (phone) {
  const phoneReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
  return phoneReg.test(phone)
}

export { isPhone }
