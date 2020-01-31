// 模拟写一个webpack的小插件，用来解决导入多次书写的问题：
// import _ from 'lodash';  => import _ from 'lodash'

// import { flatten,concat } from "lodash"  =>
// import flatten from 'lodash/flatten';
// import concat from 'lodash/concat';

let babel = require("@babel/core");
let types = require("@babel/types");

let testCode = 'import { flatten,concat } from "lodash"';

const importConver = {
  visitor: {
    ImportDeclaration: {
      // ref 配合 wbepack.config.js中的 plugins: [["import", { library: "lodash" }]] 来使用，进一步缩小需要优化代码的范围
      enter(path, ref) {
        const specifiers = path.node.specifiers;
        const source = path.node.source;
        console.log(ref.opts.library, '<----');
        if (ref.opts.library == source.value && !types.isImportDefaultSpecifier(specifiers[0])) {
          const declarations = specifiers.map(speccifierItem => {
            return types.importDeclaration(
              [types.importDefaultSpecifier(speccifierItem.local)],
              types.stringLiteral(
                `${source.value}/${speccifierItem.local.name}`
              )
            );
          });
          path.replaceWithMultiple(declarations);
        }
      }
    }
  }
};

const result = babel.transform(testCode, {
  plugins: [importConver]
});

console.log(result.code);

// !!! 将此部分的visitor代码复制到babel-plugin-import.js文件中，并导出。  babel-plugin-import.js文件需要放置在node_modules中，这样配合webpack的配置，起到自定义插件的效果
// 使用此插件后，原来打包后main.js由 483kb降到 22.7kb