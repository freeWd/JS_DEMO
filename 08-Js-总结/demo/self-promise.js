function Promise(fn) {
  const that = this;
  this.status = "pending"; // pending, resolved, rejected
  this.value = null;
  this.resolvedCallbacks = [];
  this.rejectedCallbacks = [];

  function resolve(value) {
    if (that.status === "pending") {
      that.status = "resolved";
      that.resolvedCallbacks.forEach((cb) => {
        cb(that.value);
      });
    }
  }

  function reject(value) {
    if (that.status === "pending") {
      that.status = "rejected";
      that.rejectedCallbacks.forEach((cb) => {
        cb(that.value);
      });
    }
  }

  try {
      fn(resolve, reject)
  } catch (error) {
      reject(error)
  }
}


Promise.prototype.then = function(onFulfilled, onRejected) {
    const that = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r }
    if (that.status === 'pending') {
        that.resolvedCallbacks.push(onFulfilled)
        that.rejectedCallbacks.push(onRejected)
    }
    if (that.status === 'resolv')
}

