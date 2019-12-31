const SafeFetch = require('../utils/safeFetch');
const fs = require('fs');
const path = require('path');

/**
 * Book模型类，表示书本相关的操作
 * @author 隔壁老王
 */
class BookModel {
    /**
     * @constructor
     * @param {string} app Koa2的上下文
     */
    constructor(app) {
    }

    /**
     * 获取后台图书列表信息
     */
    getBookList() {
        return new SafeFetch('/book.json').fetch();
    }

    /**
     * 添加新的书籍到存储JSON文件中
     * @param {*} 一本书的实例
     */
    addBookItem(newBookItem) {
        return new Promise((resolve) => {
            let bufferArr = [];
            let rs = fs.createReadStream(path.resolve(__dirname, '../mock/book.json'));
            rs.on('data', function(data) {
                bufferArr.push(data);
            });
            rs.on('end', function() {
                let bookData;
                try {
                    bookData = Buffer.concat(bufferArr).toString();
                    bookData = JSON.parse(bookData);
                    newBookItem = JSON.parse(newBookItem);
                    bookData.push(newBookItem);
                } catch (error) {
                    bookData = [];
                }
                let ws = fs.createWriteStream(path.resolve(__dirname, '../mock/book.json'));
                ws.write(JSON.stringify(bookData), (err) => {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    }
                    resolve(true)
                })
            })
        })
    }
}

module.exports = BookModel;
