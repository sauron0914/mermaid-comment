import fs from 'fs'
import recast from 'recast'
import { cwd, getArgvs, matchMermaidGrammar, matchPrefix, parse, traverseFile } from './utils'
import path from 'path'
import chalk from 'chalk'

const StartGrammar = `
sequenceDiagram
  Client->>BFF: 发起查询请求
`

function generate(arg, mermaidComments) {
  const code = fs.readFileSync(arg, { encoding: 'utf8' }).toString()

  const prefix = matchPrefix(code)

  const ast = parse(code) as any
  
  recast.visit(ast, {
    visitClassMethod: function (self: any){
      const node = self.value
      if(node.kind === 'method') {
        const methodBody = node.body;
        const map: any = {}
        node.decorators.forEach(decorator => {
          const { expression } = decorator ?? {}
          const { name }  = expression?.callee ?? {}
          switch (name) {
            case 'request':
              const args = expression.arguments
              map.request = {}
              map.request.method = args[0].value
              map.request.url =  prefix + args[1].value
              break;
            case 'summary':
              map.summary = decorator.expression.arguments[0].value
              break;
            default:
              break;
          }
        })
        const innerComments = self.value.body.innerComments
        const comments: any  = []
        recast.visit(methodBody, {
          visitBlockStatement(path: any) {
            const blockStatements = path.node.body;
            blockStatements.forEach((statement: any) => {
              comments.push(...(statement.leadingComments || []));
            });
            return false;
          },
        });

        map.mermaid = (innerComments?.length > 0 ? innerComments : comments).map((item: any) => matchMermaidGrammar(item.value))

        mermaidComments.push(map)
      }
     
      this.traverse(self)
    },
  })
}

const generateMermaid = () => {
    const argvs = getArgvs()
    if (argvs.length !== 1) {
      console.log(chalk.red('only supports commands mc [pathfile]'))
      return
    }

    const data = fs.statSync(cwd + argvs[0])
    const mermaidComments: any[] = []

    if (data.isFile()) {
      generate(argvs[0], mermaidComments)
    } else {
      traverseFile(
        cwd + argvs[0],
        path => {
          generate(path, mermaidComments)
        },
      )
    }

    const res = mermaidComments.reduce((acc, item)=> {
      const {request, summary, mermaid} = item
      let str = `## ${summary} ${request.method.toUpperCase()} ${request.url}\n`

      let mermaidStr = StartGrammar
      mermaid.forEach(opts=> {
        opts.forEach(opt => {
          mermaidStr += `  ${opt} \n`
        })
      })

      str += `\`\`\`mermaid${mermaidStr}\`\`\` \n\n\n`
      acc += str
      return acc
    }, '')

    fs.writeFile(path.join(path.dirname(argvs[0]), 'MERMAID.md'), res , {}, function (err) {
      
    })

}

export { generateMermaid }
