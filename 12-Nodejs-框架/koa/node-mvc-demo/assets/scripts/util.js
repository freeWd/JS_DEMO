function utils() {}

// 节流
let timer;
utils.throttle = function(fn, wait) {
  return function(...args) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      fn.apply(this, args);
    }
  };
};

export default utils;
