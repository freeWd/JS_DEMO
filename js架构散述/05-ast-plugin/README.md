## AST 抽象语法树(Abstract Syntax Tree)

webpack 和 Lint 等很多的工具和库的核心都是通过 Abstract Syntax Tree 抽象语法树这个概念来实现对代码的检查、分析等操作的

通过了解抽象语法树这个概念，可以编写类似的工具和插件

### 抽象语法树用途

- 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等

  - 如 JSLint、JSHint 对代码错误或风格的检查，发现一些潜在的错误
  - IDE 的错误提示、格式化、高亮、自动补全等等

- 代码混淆压缩

  - UglifyJS2 等

- 优化变更代码，改变代码结构使达到想要的结构
  - 代码打包工具 webpack、rollup 等等
  - CommonJS、AMD、CMD、UMD 等代码规范之间的转化
  - CoffeeScript、TypeScript、JSX 等转化为原生 Javascript

### 抽象语法树定义

这些工具的原理都是通过 JavaScript Parser 把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作。

> 在计算机科学中，抽象语法树（abstract syntax tree 或者缩写为 AST），或者语法树（syntax tree），是源代码的抽象语法结构的树状表现形式，这里特指编程语言的源代码。

> Javascript 的语法是为了给开发者更好的编程而设计的，但是不适合程序的理解。所以需要转化为 AST 来使之更适合程序分析，浏览器编译器一般会把源码转化为 AST 来进行进一步的分析等其他操作。

![image](/static/ast.jpg)

### AST 的逻辑流程

- 解析过程 AST 整个解析过程分为两个步骤
  - 分词：将整个代码字符串分割成语法单元数组
  - 语法分析：建立分析语法单元之间的关系

- 语法单元 Javascript 代码中的语法单元主要包括以下这么几种
  - 关键字：const、let、var 等
  - 标识符：可能是一个变量，也可能是 if、else 这些关键字，又或者是 true、false 这些常量
  - 运算符
  - 数字
  - 空格
  - 注释

- 词法分析
```js
let jsx = `let element=<h1>hello</h1>`;

[
  { type: "Identifier", value: "let" },
  { type: "whitespace", value: " " },
  { type: "Identifier", value: "element" },
  { type: "operator", value: "=" },
  { type: "JSXElement", value: "<h1>hello</h1>" }
];
```

- 语法分析（语义分析则是将得到的词汇进行一个立体的组合，确定词语之间的关系， 简单来说语法分析是对语句和表达式识别，这是个递归过程）
```js
{
    "type": "Program",
    "body": [{
        "type": "VariableDeclaration",
        "declarations": [{
            "type": "VariableDeclarator",
            "id": {
                "type": "Identifier",
                "name": "element"
            },
            "init": {
                "type": "JSXElement",
                "openingElement": {
                    "type": "JSXOpeningElement",
                    "name": {
                        "type": "JSXIdentifier",
                        "name": "h1"
                    }
                },
                "closingElement": {
                    "type": "JSXClosingElement",
                    "name": {
                        "type": "JSXIdentifier",
                        "name": "h1"
                    }
                },
                "name": "h1",
                "children": [{
                    "type": "JSXText",
                    "value": "hello"
                }]
            }
        }]
    }],
    "sourceType": "script"
}
```

### JavaScript Parser

JavaScript Parser，把 js 源码转化为抽象语法树的解析

- 浏览器会把 js 源码通过解析器转为抽象语法树，再进一步转化为字节码或直接生成机器码。
- 一般来说每个 js 引擎都会有自己的抽象语法树格式，Chrome 的 v8 引擎，firefox 的 SpiderMonkey 引擎等等，MDN 提供了详细 SpiderMonkey AST format 的详细说明，算是业界的标准。

常用的 JavaScript Parser (esprima 和 acorn 最常用， webpack 用的就是 acorn)

- esprima !!
- acorn !!
- traceur
- shift

### esprima
- 通过 esprima 把源码转化为AST
- 通过 estraverse 遍历并更新AST
- 通过 escodegen 将AST重新生成源码
- [astexplorer](https://astexplorer.net/) AST的可视化工具
