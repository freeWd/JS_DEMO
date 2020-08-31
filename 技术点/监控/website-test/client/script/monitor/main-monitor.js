/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/behavior.js":
/*!*************************!*\
  !*** ./src/behavior.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// // /html/body/div[2]/ul/li[2]
// 用户行为分析，获取用户的点击（或更多操作）页面的流程和顺序

class Behavior {
  static init(callBackFn) {
    document.addEventListener(
      "click",
      (e) => {
        const xpath = Util.getXPath(e.target);
        console.log("xpath", xpath);
      },
      false
    );
  }
}

const Util = {
  getXPath(ele) {
    if (!(ele instanceof Element)) {
      return;
    }

    if (ele.nodeType !== 1) {
      return;
    }

    const rootEle = document.body;
    if (ele === rootEle) {
      return;
    }

    let xpath = "";
    let childIndex = (ele) => {
      let parent = ele.parentNode;
      let children = Array.prototype.slice
        .call(parent.childNodes)
        .filter((_) => _.nodeType === 1);
      let i = 0;
      for (let _i = 0, len = children.length; _i < len; _i++) {
        if (children[_i] === ele) {
          i = _i;
          break;
        }
      }
      return i === 0 ? "" : "[" + i + "]";
    };

    while (ele !== document) {
      let tag = ele.tagName.toLocaleLowerCase();
      let eleIndex = childIndex(element);
      xpath = "/" + tag + eleIndex + xpath;
      ele = ele.parentNode;
    }
    return xpath;
  },
};


/* harmony default export */ __webpack_exports__["default"] = (Behavior);

/***/ }),

/***/ "./src/errorCatch.js":
/*!***************************!*\
  !*** ./src/errorCatch.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class ErrorCatch {
  static init(callBackFn) {
    let _error = window.onerror;
    window.onerror = function (...args) {
      const [msg, url, lineTo, columnNo, error] = args;
      const errorInfo = Util.formatError(error);
      errorInfo._errorMsg = msg;
      errorInfo._scriptURI = url;
      errorInfo._lineTo = lineTo;
      errorInfo._columnNo = columnNo;
      errorInfo._type = 'onerror';
    
      console.log('异常信息处理 =====》 onerror =====》')
      callBackFn(errorInfo);
      // _error && _error.apply(this, args);
      return true;
    };

    let _onunhandledrejection = window.onunhandledrejection;
    window.onunhandledrejection = function(...args) {
        let e = args[0];
        let reason = e.reason;
        
        const errorInfo = {
            type: e.type || 'unhandledrejection',
            reason
        }

        console.log('异常信息处理 =====》 onunhandledrejection =====》')
        callBackFn(errorInfo);
        return false;
        // _onunhandledrejection && _onunhandledrejection.apply(this, args);
    }
  }
}

const Util = {
  formatError(errObj) {
    let col = errObj.column || errObj.columnNumber; // Safari Firefox
    let row = errObj.line || errObj.lineNumber; // Safari Firefox
    let message = errObj.message;
    let name = errObj.name;
    let { stack } = errObj;
    // ReferenceError: b is not defined at http://localhost:8080/:10:21
    if (stack) {
      let matchUrl = stack.match(/https?:\/\/[^\n]+/)[0];
      let rowColumn = matchUrl.match(/https?:\/\/[\S]+(:\d+:\d+)/)[1];
      let index = matchUrl.indexOf(rowColumn);

      let errorUrl = matchUrl.slice(0, index);
      let [, errRow, errColumn] = rowColumn.match(/:(\d+):(\d+)/);

      return {
        content: stack,
        col: Number(col || errColumn),
        row: Number(row || errRow),
        message,
        name,
        errorUrl,
      };
    }
    return {
      col,
      row,
      message,
      name,
    };
  },
};

/* harmony default export */ __webpack_exports__["default"] = (ErrorCatch);


// 关于异常的信息获取还有要考虑 现代化的使用webpack打包后的应用，应用的代码都被混淆压缩，无法准确获取错误信息
// 关于这类错误，需要保留打包后的sourceMap文件，通过工具将编译后的代码转化为源码
// 查看 app-source-map.js文件 查看此类问题的demo


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _performance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./performance */ "./src/performance.js");
/* harmony import */ var _resource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./resource */ "./src/resource.js");
/* harmony import */ var _errorCatch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errorCatch */ "./src/errorCatch.js");
/* harmony import */ var _behavior__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./behavior */ "./src/behavior.js");





_performance__WEBPACK_IMPORTED_MODULE_0__["default"].init((result) => {
  console.log(result);
});

_resource__WEBPACK_IMPORTED_MODULE_1__["default"].init((result) => {
  console.log(result);
});

_errorCatch__WEBPACK_IMPORTED_MODULE_2__["default"].init((result) => {
  console.log(result);
});

_behavior__WEBPACK_IMPORTED_MODULE_3__["default"].init((result) => {});


/***/ }),

/***/ "./src/performance.js":
/*!****************************!*\
  !*** ./src/performance.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// 参考文档：https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming
// 主要获取页面加载性能相关的数据

class Performance {
  static init(callBackFn) {
    const performance =
      window.performance ||
      window.mozPerformance ||
      window.msPerformance ||
      window.webkitPerformance;
    Util.domReady(performance).then((result) => {
      console.log('性能分析结构 =====》 DomReady 阶段 =====》')
      callBackFn(result)
    });
    Util.onload(performance).then((result) => {
      console.log('性能分析结构 =====》 Onload 阶段 =====》')
      callBackFn(result)
    });
  }
}

const Util = {
  // DOM解析完成
  domReady(performance) {
    return new Promise((resolve) => {
      if (document.readyState === "interactive") {
        resolve(runCheck());
      } else {
        Util.addEventListener("DOMContentLoaded", function () {
          resolve(runCheck());
        });
      }
    });

    function runCheck() {
      return new Promise((resolve) => {
        let timer;
        if (performance.timing.domInteractive) {
          clearTimeout(timer);
          resolve(reportPerformance(performance));
        } else {
          timer = setTimeout(() => {
            resolve(runCheck());
          }, 100);
        }
      });
    }
  },

  // DOM加载完成
  onload(performance) {
    return new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve(runCheck());
      } else {
        Util.addEventListener("load", function () {
          resolve(runCheck());
        });
      }
    });

    function runCheck() {
      return new Promise((resolve) => {
        let timer;
        if (performance.timing.loadEventEnd) {
          clearTimeout(timer);
          resolve(reportPerformance(performance));
        } else {
          timer = setTimeout(() => {
            resolve(runCheck());
          }, 100);
        }
      });
    }
  },

  addEventListener: function (name, callback) {
    if (window.addEventListener) {
      return window.addEventListener(name, callback);
    } else if (window.attachEvent) {
      return window.attachEvent("on" + name, callback);
    }
  },
};

function reportPerformance(performance) {
  function filterTime(a, b) {
    return a > 0 && b > 0 && a - b >= 0 ? a - b : undefined;
  }
  const perTime = performance.timing;
  return {
    // 网络建连
    pervPage: filterTime(perTime.fetchStart, perTime.navigationStart), // 上一个页面完全销毁时间
    redirect: filterTime(perTime.responseEnd, perTime.redirectStart), // 页面重定向时间
    dns: filterTime(perTime.domainLookupEnd, perTime.domainLookupStart), // DNS查找时间
    connect: filterTime(perTime.connectEnd, perTime.connectStart), // TCP建连时间
    network: filterTime(perTime.connectEnd, perTime.navigationStart), // 网络总耗时

    // 网络接收
    send: filterTime(perTime.responseStart, perTime.requestStart), // 前端从发送到接收到后端第一个返回
    receive: filterTime(perTime.responseEnd, perTime.responseStart), // 接收页面时间
    request: filterTime(perTime.responseEnd, perTime.requestStart), // 请求页面总时间

    // 前端渲染
    dom: filterTime(perTime.domComplete, perTime.domLoading), // dom解析时间
    loadEvent: filterTime(perTime.loadEventEnd, perTime.loadEventStart), // loadEvent时间
    frontend: filterTime(perTime.loadEventEnd, perTime.domLoading), // 前端总时间

    // 关键阶段
    load: filterTime(perTime.loadEventEnd, perTime.navigationStart), // 页面完全加载总时间
    domReady: filterTime(
      perTime.domContentLoadedEventStart,
      perTime.navigationStart
    ), // domready时间
    interactive: filterTime(perTime.domInteractive, perTime.navigationStart), // 可操作时间
    ttfb: filterTime(perTime.responseStart, perTime.navigationStart), // 首字节时间
  };
}

/* harmony default export */ __webpack_exports__["default"] = (Performance);


/***/ }),

/***/ "./src/resource.js":
/*!*************************!*\
  !*** ./src/resource.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Resource {
  static init(callBackFn) {
    const performance =
      window.performance ||
      window.mozPerformance ||
      window.msPerformance ||
      window.webkitPerformance;

    if (!performance) {
      return;
    }

    if (window.PerformanceObserver) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const resourceInfoArr = Util.format(entries);
        console.log("=====> resource ====>");
        callBackFn(resourceInfoArr);
      });
      observer.observe({ entryTypes: ["resource"] });
    } else {
      if (performance.readyState === "complete") {
        const entries = performance.getEntriesByType("resource");
        const resourceInfoArr = Util.format(entries);
        console.log("=====> resource ====>");
        callBackFn(resourceInfoArr);
      } else {
        window.addEventListener("load", () => {
          const entries = performance.getEntriesByType("resource");
          const resourceInfoArr = Util.format(entries);
          console.log("=====> resource ====>");
          callBackFn(resourceInfoArr);
        });
      }
    }
  }
}

const Util = {
  format(entries) {
    return entries.map((item) => this.resolvePerformanceTiming(item));
  },

  resolvePerformanceTiming(timing) {
    function filterTime(a, b) {
      return a > 0 && b > 0 && a - b >= 0 ? a - b : undefined;
    }

    return {
      initiatorType: timing.initiatorType, // initiatorType 表示初始化性能条目的资源类型 eg：xmlhttprequest
      name: timing.name, // name == resources URL | eg: http://localhost:8080/sockjs-node/info?t=1589418505919
      duration: parseInt(timing.duration), // 它是responseEnd和startTime属性之间的差异
      redirect: filterTime(timing.redirectEnd, timing.redirectStart), // 重定向
      dns: filterTime(timing.domainLookupEnd, timing.domainLookupStart), // DNS解析
      connect: filterTime(timing.connectEnd, timing.connectStart), // TCP建连
      network: filterTime(timing.connectEnd, timing.startTime), // 网络总耗时

      send: filterTime(timing.responseStart, timing.requestStart), // 发送开始到接受第一个返回
      receive: filterTime(timing.responseEnd, timing.responseStart), // 接收总时间
      request: filterTime(timing.responseEnd, timing.requestStart), // 总时间

      ttfb: filterTime(timing.responseStart, timing.requestStart), // 首字节时间
    };
  },
};

/* harmony default export */ __webpack_exports__["default"] = (Resource);


/***/ })

/******/ });
//# sourceMappingURL=main-monitor.js.map