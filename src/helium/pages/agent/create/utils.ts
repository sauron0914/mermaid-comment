export enum OutputType {
  code = 'CODE',
  name = 'NAME'
}

// 解析省市区
// @params areas 传入的省市区数据
// @params output {OutputType}
// @return (string | number)[]
// @example1
// areas = ['120000-天津市', '120100-天津市', '120101-和平区']
// output = 'CODE'
// => [120000, 120100, 120101]
// @example2
// areas = ['120000-天津市', '120100-天津市', '120101-和平区']
// output = 'NAME'
// => ['天津市', '天津市', '和平区']

export const formatAreas = (areas: string[], type: OutputType): (string | number)[] => {
  return areas.map((area) => {
    const [code, name] = area.split('-')
    if (type === 'CODE') {
      return Number(code)
    } else if (type === 'NAME') {
      return name
    }
    return ''
  })
}
