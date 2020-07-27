//  预计算babel插件

// 转换前：const result = 1 + 2 + 5;
// 转化后：const result = 8;


const babel = require('@babel/core');
const types = require('@babel/types');

const code = 'const result = 1 + 2 + 5;';

const preCalculator = {
    visitor: {
        // 从外到内
        BinaryExpression: (path) => {
            let node=path.node;
            let left = node.left;
            let right = node.right;
            console.log(left.value, right.value)
            // undefined 5
            // 1 2
            // 3 5
            let operator=node.operator;
            if (!isNaN(left.value) && !isNaN(right.value)) {
                let result = eval(left.value+operator+right.value);
                path.replaceWith(types.numericLiteral(result)); // 完整节点的替换
                if (path.parent && path.parent.type === 'BinaryExpression') {
                    preCalculator.visitor.BinaryExpression.call(null,path.parentPath);
                }
            }
        }
    }
};

const result = babel.transform(code, {
    plugins: [preCalculator]
});

console.log(result.code);
