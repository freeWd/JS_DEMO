// 转换箭头函数 task ===> 使用 esprima， 将源码转换为抽象语法树，再稍作调整，将es6的箭头函数转化为普通函数

// // 原函数
// const sum = (a, b) => a + b;

// // 转化后的函数
// var sum = function sum(a, b) {
//   return a + b;
// };


// 测试实例，先https://astexplorer.net/网站将转化前后的函数的抽象语法树展示出来，根据区别，依次调整
let babel = require('@babel/core');
let types = require('@babel/types');

const code = "const sum = (a, b) => a + b";

// 自定义插件；
let transformArrowFunctions = {
    // 遵循babel的回调的固定写法
    // 这个访问者会对特定节类型的节点进行处理
    visitor: {
        VariableDeclaration: (path) => {
            let node = path.node;
            node.kind = 'var';
        },
        ArrowFunctionExpression: (path) => {
            let node = path.node;
            let id = path.parent.id;
            let params = node.params;
            let body = types.blockStatement([
                types.returnStatement(node.body)
            ]);
            // https://babeljs.io/docs/en/next/babel-types.html
            let func = types.functionExpression(id, params, body);
            path.replaceWith(func);
        }
    }
};

// babel会先把内部代码转化成AST，然后进行遍历，配合插件修改对应节点的内容...
let result = babel.transform(code, {
    plugins: [transformArrowFunctions]
});

console.log(result.code);