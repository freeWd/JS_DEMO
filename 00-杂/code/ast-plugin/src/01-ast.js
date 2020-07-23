let esprima = require('esprima'); // 生成ast
let estraverse = require('estraverse'); // 解析，修改ast
let escodegen = require('escodegen'); // 还原为代码

let code = 'function ast() {}';

// 将脚本转化成抽象语法树
let ast = esprima.parseScript(code);
console.log(ast);


// 每个节点都会遍历的进入一次，再退出一次
estraverse.traverse(ast, {
    enter: function(node) {
        console.log('enter', node.type);
        if (node.type === 'Identifier') {
            node.name += '_enter';
        }
    },
    leave: function(node) {
        console.log('leave', node.type);
        if (node.type === 'Identifier') {
            node.name += '_leave';
        }
    }
});

let result = escodegen.generate(ast);
console.log(result);

