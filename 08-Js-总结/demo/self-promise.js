function MyPromise(fn) {
  const that = this;
  this.status = "pending"; // pending, resolved, rejected
  this.value = null;
  this.resolvedCallbacks = [];
  this.rejectedCallbacks = [];

  function resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(resolve, reject); // !====> 如果resolve(value) 中的value是promise就返回它then回调中接收的value
    }
    if (that.status === "pending") {
      that.status = "resolved";
      that.value = value;
      that.resolvedCallbacks.forEach((cb) => {
        cb(that.value);
      });
    }
  }

  function reject(value) {
    if (that.status === "pending") {
      that.status = "rejected";
      that.value = value;
      that.rejectedCallbacks.forEach((cb) => {
        cb(that.value);
      });
    }
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  function resolutionProcedure(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError("Error"));
    }
    if (x instanceof MyPromise) {
      x.then(function (value) {
        resolutionProcedure(promise2, value, resolve, reject);
      }, reject);
    }
    let called = false;
    if (x !== null && (typeof x === "object" || typeof x === "function")) {
      try {
        let then = x.then;
        if (typeof then === "function") {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              resolutionProcedure(promise2, y, resolve, reject);
            },
            (e) => {
              if (called) return;
              called = true;
              reject(e);
            }
          );
        } else {
          resolve(x);
        }
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      resolve(x);
    }
  }

  const that = this;
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (r) => {
          throw r;
        };
  if (that.status === "pending") {
    // that.resolvedCallbacks.push(onFulfilled);
    // that.rejectedCallbacks.push(onRejected);
    const promise2 = new MyPromise((resolve, reject) => {
      that.resolvedCallbacks.push(() => {
        try {
          const x = onFulfilled(that.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });

      that.rejectedCallbacks.push(() => {
        try {
          const x = onRejected(that.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });
    });
    return promise2;
  }
  if (that.status === "resolved") {
    // onFulfilled(that.value);
    const promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onFulfilled(that.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    });
    return promise2;
  }
  if (that.status === "rejected") {
    // onRejected(that.value);
    const promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onRejected(that.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    });
    return promise2;
  }
};

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(Promise.resolve(123));
  }, 1000);
})
  .then((value) => {
    console.log(value);
    return value + "xxx";
  })
  .then((value) => {
    console.log(value);
  });
