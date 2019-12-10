// Promise A+ --- 手写 Promise

// 初步构建
function Promise(fn) {
  var that = this;
  this.value = null;
  this.status = "pending";
  this.resolveCallBackArr = [];
  this.rejectCallBackArr = [];

  function resolve(value) {
    that.value = value;
    that.status = "resolve";
    if (that.resolveCallBackArr.length > 0) {
      that.resolveCallBackArr.forEach(callBackFn => {
        that.value = callBackFn(that.value);
      });
    }
  }

  function reject(value) {
    that.value = value;
    that.status = "reject";
    if (that.rejectCallBackArr.length > 0) {
      that.rejectCallBackArr.forEach(callBackFn => {
        that.value = callBackFn(that.value);
      });
    }
  }

  fn(resolve, reject);
}

Promise.prototype.then = function(resolveCallBack, rejectCallBack) {
  return new Promise((resolve, reject) => {
    function handle(value) {
      var newValue =
        (typeof resolveCallBack === "function" && resolveCallBack(value)) ||
        value;
      if (newValue && typeof newValue["then"] === "function") {
        newValue.then(
          function(v) {
            resolve(v);
          },
          function(e) {
            reject(e);
          }
        );
      } else {
        resolve(newValue);
      }
    }

    function errorHandle(value) {
      var newValue =
        (typeof rejectCallBack === "function" && rejectCallBack(value)) ||
        value;
      if (newValue && typeof newValue["then"] === "function") {
        newValue.then(
          function(v) {
            resolve(v);
          },
          function(e) {
            reject(e);
          }
        );
      } else {
        resolve(newValue);
      }
    }

    if (this.status === "pending") {
      this.resolveCallBackArr.push(handle);
      this.rejectCallBackArr.push(errorHandle);
    } else if (this.status === "resolve") {
      handle(this.value);
    } else if (this.status === "reject") {
      errorHandle(this.value);
    }
  });
};

Promise.resolve = function(value) {
  return new Promise(resolve => {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise((resolve, reject) => {
    reject(value);
  });
};

Promise.all = function(promiseArr) {
  return new Promise((resolve, reject) => {
    let result = [];
    let total = 0;
    for (const promiseItem of promiseArr) {
      let promiseFn = null;
      if (!promiseItem instanceof Promise) {
        promiseFn = Promise.resolve(promiseItem);
      } else {
        promiseFn = promiseItem;
      }
      promiseFn.then(
        v => {
          total++;
          result.push(v);
          if (total === promiseArr.length) {
            resolve(result);
          }
        },
        e => {
          reject(e);
        }
      );
    }
  });
};

Promise.race = function(promiseArr) {
    return new Promise((resolve, reject) => {
        for (const promiseItem of promiseArr) {
            let promiseFn = null;
            if (!promiseItem instanceof Promise) {
                promiseFn = Promise.resolve(promiseItem);
            } else {
                promiseFn = promiseItem;
            }
            promiseFn.then(v => {
                resolve(v);
            }, e => {
                reject(e);
            });
        }
    });
}

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(10);
  }, 1000);
});

p.then(
  val => {
    console.log(val, "<----1");
    return val + 1;
  },
  err => {
    console.log(err, "<-----11");
    return err + 2;
  }
).then(val => {
  console.log(val, "<----2");
});
