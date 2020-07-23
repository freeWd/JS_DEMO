// 该loader的功能是：将options中的文件路径对应的文件读取出来，添加到source的前面

const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const fs = require('fs');

function loader(source) {
    //把loader改为异步,任务完成后需要手工执行callback
    let cb = this.async();

    // 启用loader缓存
    this.cacheable && this.cacheable();

    // 用来验证options的合法性
    let schema = {
        type: 'object',
        properties: {
            filename: {
                type: 'string'
            },
            text: {
                type: 'string'
            }
        }
    }

    //通过工具方法获取options
    let options = loaderUtils.getOptions(this);
    // 用来验证options的合法性
    validateOptions(schema, options);

    let {filename } = options;
    fs.readFile(filename, 'utf8', (err, text) => {
        cb(err, text + source);
    });
}

module.exports = loader;