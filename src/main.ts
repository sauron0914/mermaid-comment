import fs from 'fs'
import recast from 'recast'
import { getArgvs, matchMermaidGrammar, parse } from './utils'
import path from 'path'

const StartGrammar = `
  sequenceDiagram
    Client->>BFF: 发起查询请求
`

const generateMermaid = () => {
    const argvs = getArgvs()
    const code = fs.readFileSync(argvs[0], { encoding: 'utf8' }).toString()
    const ast = parse(code) as any
    const mermaidComments: any[] = []
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
                map.request.url = args[1].value
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

    const res = mermaidComments.reduce((acc, item)=> {
      const {request, summary, mermaid} = item
      let str = ` ## ${summary} ${request.method.toUpperCase()} ${request.url} \n`

      let mermaidStr = StartGrammar
      mermaid.forEach(opts=> {
        opts.forEach(opt => {
          mermaidStr += `     ${opt} \n`
        })
      })

      str += `\`\`\`mermaid${mermaidStr}\`\`\` \n\n\n `
      acc += str
      return acc
    }, '')

    fs.writeFile(path.join(path.dirname(argvs[0]), '..', 'MERMAID.md'), res , {}, function (err) {
      
    })

}

export { generateMermaid }
