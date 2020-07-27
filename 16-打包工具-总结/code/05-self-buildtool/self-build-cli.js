const path = require("path");
const fs = require("fs");

const esprima = require("esprima");
const estraverse = require("estraverse");

const CONFIG_FILE = "build.config.js";

// 解析配置文件
function resolveConfigFile(filePath) {
  const configInfo = require(filePath);
  return {
    entry: path.join(__dirname, configInfo.entry),
    relativePath: configInfo.entry,
    outputFolder: configInfo.output.path,
    outputFile: configInfo.output.filename
  }
}

function readCode(absFilePath) {
  // 读取文件内容
  const content = fs.readFileSync(absFilePath, "utf-8");
  // 生成AST
  const ast = esprima.parseScript(content);
  const depencyFile = [];

  estraverse.traverse(ast, {
    enter: function (node) {
      if (
        node.callee &&
        node.callee.type === "Identifier" &&
        node.callee.name === "require"
      ) {
        depencyFile.push(node.arguments[0].value);
      }
    },
  });
  return {
    filePath: absFilePath,
    code: content,
    depency: depencyFile,
  };
}

function getDependency(entryAbsFilePath) {
  const dirName = path.dirname(entryAbsFilePath)
  const entryObj = readCode(entryAbsFilePath);
  const bundleArr = [entryObj];

  entryObj.depency.forEach((depItem) => {
    const depAbsPath = path.join(dirName, depItem)
    if (/\.css$/.test(depItem)) {
      const cssContent = fs.readFileSync(depAbsPath, "utf-8");
      const cssCode = `
            const style = document.createElement('style');
            style.innerText = ${JSON.stringify(cssContent).replace(
              /\\r\\n/g,
              ""
            )}
        `;
      bundleArr.push({
        filePath: depAbsPath,
        relativePath: depItem,
        code: cssCode,
        depency: [],
      });
    } else {
        const childEntryObj = readCode(depAbsPath)
        childEntryObj.relativePath = depItem
        bundleArr.push(childEntryObj)
    }
  });
  return bundleArr;
}

function createBundle(bundleArr, entryConfigInfo) {
    let moduleParam = '';
    bundleArr.forEach(bundItem => {
        const filePath = bundItem.relativePath || entryConfigInfo.relativePath
        moduleParam += `"${filePath}": function(module, exports, require){ ${bundItem.code} },`
    })

    const result = `
        (function(moduleId) {
            function require(id) {
                const module = { exports: {} }
                modules[id](module, module.exports, require)
                return modules.exports
            }
            require(${entryConfigInfo.relativePath})
        })({ ${moduleParam} })
    `
    return result
}


// ====> 调用  === 代码没有测试，绝对有bug, 结果不保证！！！！
const configFilePath = path.resolve(__dirname, "./", CONFIG_FILE);
const configInfo = resolveConfigFile(configFilePath);

const bundleArr = getDependency(configInfo.entry);
const result = createBundle(bundleArr, configInfo)

const outputAbsFilePath = path.join(configInfo.outputFolder, configInfo.outputFile);
fs.access(configInfo.outputFolder, (err, state) => {
    if (err) {
        fs.mkdirSync(configInfo.outputFolder)
        fs.writeFileSync(outputAbsFilePath, result)
    }
})