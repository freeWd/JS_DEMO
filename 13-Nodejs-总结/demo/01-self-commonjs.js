// ====> Self Code
const path = require("path");
const fs = require("fs");
const vm = require("vm");

function selfRequire(filePath) {
  if (filePath.startsWith("./") || filePath.startsWith("/")) {
    const absPath = path.resolve(__dirname, filePath);
    let extName = path.extname(absPath) || null;
    let fullFilePath = absPath
    if (!extName) {
      fullFilePath = loopFindFile(absPath);
      extName = path.extname(fullFilePath);
    }

    if (SelfModule.cache[fullFilePath]) {
      return SelfModule.cache[fullFilePath].exports;
    } else {
      const module = new SelfModule(fullFilePath)
      SelfModule.cache[fullFilePath] = module
      SelfModule.extNameList[extName](module)
      return module.exports
    }
  } else {
    require(filePath);
  }

  function loopFindFile(absPath) {
    const extNameKeys = Object.keys(SelfModule.extNameList);
    let index = 0;
    while (index < extNameKeys.length) {
      const filePath = absPath + extNameKeys[index++];
      try {
        fs.existsSync(filePath);
        return filePath;
      } catch (error) {
        if (index >= extNameKeys.length - 1) {
          throw "No File Find";
        }
      }
    }
  }
}

function SelfModule(id) {
  this.id = id;
  this.exports = {};
}

SelfModule.cache = {};

SelfModule.wrapper = [
  "(function(module, exports, require, __dirname, __filename) {",
  "})",
];

SelfModule.extNameList = {
  ".js": function (module) {
    const fileContent = fs.readFileSync(module.id, "utf-8");
    const executeCodeStr = SelfModule.wrapper[0] + fileContent + SelfModule.wrapper[1];
    const realExecuteFn = vm.runInThisContext(executeCodeStr);
    realExecuteFn.call(module, module, module.exports, selfRequire);
  },
  ".json": function (module) {
    const fileContent = fs.readFileSync(module.id, "utf-8");
    module.exports = fileContent
  },
};





// ====> Test Code
const test = selfRequire('./01-module-export.js')
test()