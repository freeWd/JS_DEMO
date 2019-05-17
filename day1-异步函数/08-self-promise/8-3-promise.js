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
      that.successMethodArr.forEach(fn => fn());
    }
  }

  function reject(value) {
    if (that.status === 'pending') {
      that.status = 'reject';
      that.value = value;
      that.errorMethodArr.forEach(fn => fn());
    }
  }

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

function loopParsePromise(promise, callBackValue, resolve2, reject2) {
  if (promise === callBackValue) {
    reject2('error 循环调用');
  }
  if ((callBackValue !== null && typeof callBackValue === 'object') || typeof callBackValue === 'function') {
    // callBackValue有可能是一个promise对象
    let then = callBackValue.then;
    if (typeof then === 'function') {
      // callBackValue确认是一个promise对象
      then.call(callBackValue, y => {
        loopParsePromise(promise, y, resolve2, reject2);
      }, r => {
        reject2(r);
      });
    } else {
      resolve2(callBackValue);
    }
  } else {
    resolve2(callBackValue);
  }

}

Promise.prototype.then = function (successFn, errorFn) {
  let that = this;
  successFn = typeof successFn === 'function'?successFn : value=> value;
  errorFn = typeof errorFn === 'function'? errorFn:err=>{throw err}

  let promise = new Promise(function (resolve2, reject2) {
    if (that.status === 'resolve') {
      setTimeout(() => {
        try {
          let callBackValue = successFn(that.value);
          loopParsePromise(promise, callBackValue, resolve2, reject2);
        } catch (error) {
          reject2(error);
        }
      })
    }
    if (that.status === 'reject') {
      setTimeout(() => {
        try {
          let callBackValue = errorFn(that.value);
          loopParsePromise(promise, callBackValue, resolve2, reject2);
        } catch (error) {
          reject2(error);
        }
      })
    }

    if (that.status === 'pending') {
      that.successMethodArr.push(function () {
        setTimeout(() => {
          try {
            let callBackValue = successFn(that.value);
            loopParsePromise(promise, callBackValue, resolve2, reject2);
          } catch (error) {
            reject2(error);
          }
        })
      });
      that.errorMethodArr.push(function () {
        setTimeout(() => {
          try {
            let callBackValue = errorFn(that.value);
            loopParsePromise(promise, callBackValue, resolve2, reject2);
          } catch (error) {
            reject2(error);
          }
        })
      });
    }
  });

  return promise;
}

Promise.prototype.catch = function (errFn) {
  return this.then(null, errFn);
}

Promise.resolve = function (params) {
  return new Promise((resolve) => resolve(params));
}

Promise.reject = function (params) {
  return new Promise((resolve, reject) => reject(params));
}

Promise.all = function (paramArr) {
  return new Promise(function (resolve, reject) {
    let data = [];

    for (let index = 0; index < paramArr.length; index++) {
      const paramItem = paramArr[index];
      let promiseFn = null;

      if (!(paramItem instanceof Promise)) {
        promiseFn = Promise.resolve(paramItem);
      } else {
        promiseFn = paramItem;
      }

      promiseFn.then(value => {
        data.push(value);
        if (index === paramArr.length-1 && index === data.length-1) {
          resolve(data);
        }
      }, error => {
          reject(error);
      })
    }
  });
}

Promise.race = function(paramArr) {
  return new Promise((resolve, reject) => {
    for (let index = 0; index < paramArr.length; index++) {
      const paramItem = paramArr[index];
      if (paramItem instanceof Promise) {
        paramItem.then((value) => {
          resolve(value)
        }, (error) => {
          resolve(error);
        });
      } else {
        resolve(paramItem);
      }
    }
  });
}

// // 实现一个promise的延迟对象 defer
Promise.defer = Promise.deferred = function(){
  let dfd = {};
  dfd.promise = new Promise((resolve, reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
  });
  return dfd;
}

module.exports = Promise;