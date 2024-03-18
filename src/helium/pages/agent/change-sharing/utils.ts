export enum OutputType {
  code = 'CODE',
  name = 'NAME'
}

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
