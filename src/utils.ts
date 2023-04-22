export const getArgvs = () =>
  [...process.argv].splice(2).map(item => {
    if (item.substr(item.length - 1) === '/') {
      return item.substr(0, item.length - 1)
    }
    return item
  })

export const cwd = process.cwd() + '/'