
function Promise(executor) {
    let that = this;
    this.status = 'pending';
    this.value = null;
    this.error = null;
    this.successMethodArr = [];
    this.errorMethodArr = [];
    
    function resolve(value) {
        if (that.status === 'pending') {
            that.status = 'resolve';
            that.value = value;
            that.successMethodArr.forEach(fn => fn(that.value));
        }
    }

    function reject(error) {
        if (that.status === 'pending') {
            that.status = 'reject';
            that.error = error;
            that.errorMethodArr.forEach(fn => fn(that.error));
        }
    }

    executor(resolve, reject);
}

Promise.prototype.then = function(successFn, errorFn) {
    let that = this;
    if (that.status === 'resolve') {
        successFn(that.value);
    } 
    if (that.status === 'reject') {
        errorFn(that.error);
    } 
    if (that.status === 'pending') {
        that.successMethodArr.push(successFn);
        that.errorMethodArr.push(errorFn);
    } 
}

module.exports = Promise;