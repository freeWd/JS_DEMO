// 手写一个我们自己的require
let path = require('path');
let fs = require('fs');
let vm = require('vm');

function Module(id) {
    this.id = id;
    this.exports = {};
}

Module.wrapper = [
    '(function(exports, module, require, __dirname, __filename) {',    
    '})'
]

Module.cache = {}

Module.extNameList = {
    '.js': function (module) {
       let content = fs.readFileSync(module.id, 'utf8');
       let fnStr = Module.wrapper[0] + content + Module.wrapper[1]; 
       let fn = vm.runInThisContext(fnStr);
       fn.call(module.exports, module.exports, module, req);
    },
    '.json': function(module) {
        let json = fs.readFileSync(module.id, 'utf8');
        module.exports = json;
    }
}

function tryModuleLoad(module) {
    let extName = path.extname(module.id);
    Module.extNameList[extName](module);
}

function req(filePath) {
    let absFilePath = path.resolve(__dirname, filePath);

    let index = 0;
    let extnameList = Object.keys(Module.extNameList);
    let extname = path.extname(absFilePath);

    if (!extname) {
        loopFileExtendName();
    }   

    function loopFileExtendName() {
        if (index >= extnameList.length) {
            throw new Error('文件不存在');
        }
        let tempFilePath = absFilePath + extnameList[index++];
        try {
            fs.accessSync(tempFilePath);
            absFilePath = tempFilePath;
        } catch(e) {
            loopFileExtendName();
        }
    }


    if (Module.cache[absFilePath]) {
        return Module.cache[absFilePath].exports;    
    } else {
        let module = new Module(absFilePath);
        Module.cache[absFilePath] = module;
        tryModuleLoad(module);
        return module.exports;
    }
    
}



let testFn = req('./03-module-export');
let testFn2 = req('./03-module-export');
testFn();
testFn2();