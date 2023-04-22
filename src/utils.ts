import parser from '@babel/parser'

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