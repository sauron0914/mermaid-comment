import parser from '@babel/parser'
import fs from 'fs'

export const traverseFile: (src: string, callback: (path: string) => void) => void = (
  src,
  callback,
) => {
  let paths = fs.readdirSync(src).filter(item => item !== 'node_modules')
  paths.forEach(path => {
    const _src = src + '/' + path
    try {
      const statSyncRes = fs.statSync(_src)
      if (statSyncRes.isFile()) {
        callback(_src)
      } else if (statSyncRes.isDirectory()) {
        //是目录则 递归
        traverseFile(_src, callback)
      }
    } catch (error) {}
  })
}

export const cwd = process.cwd() + '/'

export const getArgvs = () =>
  [...process.argv].splice(2).map(item => {
    if (item.substr(item.length - 1) === '/') {
      return item.substr(0, item.length - 1)
    }
    return item
  })

export function parse (code: string) {
  try {
    return parser.parse(code, {
      sourceType: 'module',
      plugins: ["typescript", "decorators-legacy"],
    })
  } catch (error) {
    console.log(error)
  }
}

export function parseOptGrammar(optGrammar: string) {
  const match = optGrammar.match(/([a-zA-Z]+)|([^a-zA-Z]+)/g) || []
  if(match.length > 1) {
    return [match[0], match[1]]
  } else return match
}


export function matchMermaidGrammar (str: string) {
  const pattern = /@mc:\s*(\s*[^@]+)\s*(?:@return:\s*([^@]+))?/;
  const match = str.match(pattern);
  const sentences: any[] = []

  if (match) {
    const [key, value] = match[1].split(':')

    const [opt, target] = parseOptGrammar(key)
    if(target) {
      sentences.push(`BFF${opt}${target}: ${value}`)
    } else sentences.push(`${opt} ${value ?? ''}`)
   
    if (match[2]) {
      sentences.push(`${target}-->>BFF: ${match[2]}`)
    }
  }

  return sentences
}

export function matchPrefix(str: string) {
  const regex = /@prefix\('([^']*)'\)/

  const match = str.match(regex)

  if (match) {
    const result = match[1]
    return result
  } else return ''
}