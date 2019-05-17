/**
 * 手写promise. 写之前先有个整体的思路。 
 * （1）promise是一个高级函数
 * （2）我们可以看到 new Promise(xxx)的时候，xxx是入参，数据类型是一个function, 
 * （3）xxx又传入两个参数，resolve, reject, 这两个参数也是function。
 *  (4)resolve, reject什么时候调用，怎么调用的逻辑是 使用promise的人去编写的和Promise本身无关
 * （5）调用者在xxx中编写调用resolve和reject的逻辑生效，意味着在new Prosmise的时候，xxx本身作为函数就要被执行
 * （6）resolve, reject内部的具体逻辑和调用者无关，是需要在promise中定义好的。
 *  (7) resolve, reject的入参在then方法中也能拿到，说明需要在promise中使用变量将入参长期存储。
 */

function Promise(executor) {
    let that = this;
    that.value = null;
    that.error = null;
    that.status = 'pending';

    function resolve(value) {
        if (that.status === 'pending') {
            that.status = 'resolve';
            that.value = value;
        }
    }

    function reject(error) {
        if (that.status === 'pending') {
            that.status = 'reject';
            that.error = error;
        }
    }

    executor(resolve, reject);
}

Promise.prototype.then = function(successFn, errorFn) {
    if (this.status === 'resolve') {
        successFn(this.value);
    } else if (this.status === 'reject') {
        errorFn(this.error);
    }
}

module.exports = Promise;