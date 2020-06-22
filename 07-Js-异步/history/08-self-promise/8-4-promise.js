function Promise(executor) {
    let that = this;
    this.status = 'pending';
    this.value = null;
    this.error = null;
    this.successFnArr = [];
    this.errorFnArr = [];

    function resolve(value) {
        if (that.status === 'pending') {
            that.value = value;
            that.status = 'resolve';
            that.successFnArr.forEach(fn => fn());
        }
    }

    function reject(error) {
        if (that.status === 'pending') {
            that.error = error;
            that.status = 'reject';
            this.errorFnArr.forEach(fn => fn());
        }
    }

    try {
        executor(resolve, reject);
    } catch (error) {
        reject(error);
    }
}

function loopResolveParam(promise, returnValue, resolve, reject) {
    if (promise === returnValue) {
        reject('Error: 循环调用');
    }
    if ((returnValue !== null && typeof returnValue === 'object') || typeof returnValue === 'function') {
        if (typeof returnValue.then === 'function') {
            // x是一个promise
            returnValue.then(y => {
                loopResolveParam(promise, y, resolve, reject);
            }, e => {
                reject(e);
            })
        } else {
            resolve(returnValue);
        }
    } else {
        resolve(returnValue);
    }
}

Promise.prototype.then = function (successFn, errorFn) {
    let that = this;
    successFn = typeof successFn === 'function'?successFn : value=> value;
    errorFn = typeof errorFn === 'function'? errorFn:err=>{throw err}

    let p = new Promise(function (resolve, reject) {
        if (that.status === 'resolve') {
            try {
                setTimeout(() => {
                    let x = successFn(that.value);
                    loopResolveParam(p, x, resolve, reject);
                })
            } catch (error) {
                reject(error);
            }
        }
        if (that.status === 'reject') {
            try {
                setTimeout(() => {
                    let x = errorFn(that.error);
                    loopResolveParam(p, x, resolve, reject);
                })
            } catch (error) {
                reject(error);
            }

        }
        if (that.status === 'pending') {
            try {
                that.successFnArr.push(function () {
                    setTimeout(() => {
                        let x = successFn(that.value);
                        loopResolveParam(p, x, resolve, reject);
                    })
                });
            } catch (error) {
                reject(error);
            }
            that.errorFnArr.push(function () {
                try {
                    setTimeout(() => {
                        let x = errorFn(that.error);
                        loopResolveParam(p, x, resolve, reject);
                    })
                } catch (error) {
                    reject(error);
                }
            });
        }
    });
    return p;
}

Promise.prototype.catch = function (errFn) {
    return this.then(null, errFn);
}

Promise.resolve = function(value) {
    return new Promise(function(resolve) {
        resolve(value);
    })
}

Promise.reject = function(err) {
    return new Promise(function(resolve, reject) {
        reject(err);
    })
}

Promise.all = function(paramArr) {
    return new Promise(function(resolve, reject) {
        let data = [];

        for (const paramItem of paramArr) {
            if (paramItem instanceof Promise) {
                paramItem.then(value => {
                    data.push(value);
                    if (data.length === paramArr.length) {
                        resolve(data);
                    }
                }, error => {
                    reject(error);
                })
            } else {
                data.push(paramItem);
                if (data.length === paramArr.length) {
                    resolve(data);
                }
            }
            
        }
    });
}

Promise.race = function(paramArr) {
    return new Promise(function(resolve, reject) {
        for (const paramItem of paramArr) {
            if (paramItem instanceof Promise) {
                paramItem.then(value => {
                    resolve(value);
                }, error => {
                    reject(error);
                })
            } else {
                resolve(paramItem);
            }
        }
    });
}

module.exports = Promise;