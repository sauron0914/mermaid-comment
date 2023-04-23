import fs from 'fs';
import recast from 'recast';
import parser from '@babel/parser';
import path from 'path';
import chalk from 'chalk';

const traverseFile = (src, callback) => {
    let paths = fs.readdirSync(src).filter(item => item !== 'node_modules');
    paths.forEach(path => {
        const _src = src + '/' + path;
        try {
            const statSyncRes = fs.statSync(_src);
            if (statSyncRes.isFile()) {
                callback(_src);
            }
            else if (statSyncRes.isDirectory()) {
                //是目录则 递归
                traverseFile(_src, callback);
            }
        }
        catch (error) { }
    });
};
const cwd = process.cwd() + '/';
const getArgvs = () => [...process.argv].splice(2).map(item => {
    if (item.substr(item.length - 1) === '/') {
        return item.substr(0, item.length - 1);
    }
    return item;
});
function parse(code) {
    try {
        return parser.parse(code, {
            sourceType: 'module',
            plugins: ["typescript", "decorators-legacy"],
        });
    }
    catch (error) {
        console.log(error);
    }
}
function parseOptGrammar(optGrammar) {
    const match = optGrammar.match(/([a-zA-Z]+)|([^a-zA-Z]+)/g) || [];
    if (match.length > 1) {
        return [match[0], match[1]];
    }
    else
        return match;
}
function matchMermaidGrammar(str) {
    const pattern = /@mc:\s*(\s*[^@]+)\s*(?:@return:\s*([^@]+))?/;
    const match = str.match(pattern);
    const sentences = [];
    if (match) {
        const [key, value] = match[1].split(':');
        const [opt, target] = parseOptGrammar(key);
        if (target) {
            sentences.push(`BFF${opt}${target}: ${value}`);
        }
        else
            sentences.push(`${opt} ${value ?? ''}`);
        if (match[2]) {
            sentences.push(`${target}-->>BFF: ${match[2]}`);
        }
    }
    return sentences;
}
function matchPrefix(str) {
    const regex = /@prefix\('([^']*)'\)/;
    const match = str.match(regex);
    if (match) {
        const result = match[1];
        return result;
    }
    else
        return '';
}

const StartGrammar = `
sequenceDiagram
  Client->>BFF: 发起查询请求
`;
function generate(arg, mermaidComments) {
    const code = fs.readFileSync(arg, { encoding: 'utf8' }).toString();
    const prefix = matchPrefix(code);
    const ast = parse(code);
    recast.visit(ast, {
        visitClassMethod: function (self) {
            const node = self.value;
            if (node.kind === 'method') {
                const methodBody = node.body;
                const map = {};
                node.decorators.forEach(decorator => {
                    const { expression } = decorator ?? {};
                    const { name } = expression?.callee ?? {};
                    switch (name) {
                        case 'request':
                            const args = expression.arguments;
                            map.request = {};
                            map.request.method = args[0].value;
                            map.request.url = prefix + args[1].value;
                            break;
                        case 'summary':
                            map.summary = decorator.expression.arguments[0].value;
                            break;
                    }
                });
                const innerComments = self.value.body.innerComments;
                const comments = [];
                recast.visit(methodBody, {
                    visitBlockStatement(path) {
                        const blockStatements = path.node.body;
                        blockStatements.forEach((statement) => {
                            comments.push(...(statement.leadingComments || []));
                        });
                        return false;
                    },
                });
                map.mermaid = (innerComments?.length > 0 ? innerComments : comments).map((item) => matchMermaidGrammar(item.value));
                mermaidComments.push(map);
            }
            this.traverse(self);
        },
    });
}
const generateMermaid = () => {
    const argvs = getArgvs();
    if (argvs.length !== 1) {
        console.log(chalk.red('only supports commands mc [pathfile]'));
        return;
    }
    const data = fs.statSync(cwd + argvs[0]);
    const mermaidComments = [];
    if (data.isFile()) {
        generate(argvs[0], mermaidComments);
    }
    else {
        traverseFile(cwd + argvs[0], path => {
            generate(path, mermaidComments);
        });
    }
    const res = mermaidComments.reduce((acc, item) => {
        const { request, summary, mermaid } = item;
        let str = `## ${summary} ${request.method.toUpperCase()} ${request.url}\n`;
        let mermaidStr = StartGrammar;
        mermaid.forEach(opts => {
            opts.forEach(opt => {
                mermaidStr += `  ${opt} \n`;
            });
        });
        str += `\`\`\`mermaid${mermaidStr}\`\`\` \n\n\n`;
        acc += str;
        return acc;
    }, '');
    fs.writeFile(path.join(path.dirname(argvs[0]), 'MERMAID.md'), res, {}, function (err) {
    });
};

export { generateMermaid };
