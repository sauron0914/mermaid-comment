# mermaid-comment Library

`mermaid-comment` 是一个 JavaScript 库，允许您从代码注释生成美人鱼图。 具体来说，您可以在您的函数中编写注释，其中包含特别标记的 Mermaid 代码，该库将生成一个 MERMAID.md 文件，可以预览该文件以显示 `sequenceDiagram` 图。 目前，该库仅支持 `sequenceDiagram。`


## Installation
```sh
npm install mermaid-comment
```

## Usage
你可以在你的项目中使用 `mermaid-comment`，方法是将它导入你的 JavaScript 或 TypeScript 文件：

```diff
// package.json
{
  "scripts": {
+    "mc": "mc"
  },
}
```

```sh
yarn mc ./src/modules/shop/controller
```

## Code Example
以下是如何使用 `mermaid-comment` 的示例：
```ts
@prefix('/agency-scheme')
export default class AgencySchemeApplicationController extends Controller {
 
  @request('post', '/application')
  @summary('创建代运维方案')
  async createApply (ctx: Context) {
    // TODO:
    // @mc:->>hulk: 获取userId 对应的 agentId  @return: 返回agentId
    const { agentId } = await this.hulk.getAgentId(userId)
    // @mc:par: 遍历处理子方案数据
    // ...your code
    // @mc:->>agent: 请求代理商信息  @return: 返回代理商信息
    /**
     *  ...your code
    */
    const { validatedBody } = ctx
    const data = await this.windrunner.saveAgencySchemeApplication({
      ...validatedBody,
      curLoginUserId: getUserId(ctx),
    })
    // @mc:and: 处理其他事项
    // @mc:->>windrunner: 检查主方案是否能够发起变更 @return: 返回bool值
    // @mc:and: 处理其他事项2
    // @mc:->>BFF: 组装子方案数据
    // @mc:end
    // @mc:->>BFF: 组装主方案数据
    // @mc:->>Client: 返回组装后的数据
    ctx.toResponse.ok(data)
  }
}
```

## License
This library is released under the MIT License.
