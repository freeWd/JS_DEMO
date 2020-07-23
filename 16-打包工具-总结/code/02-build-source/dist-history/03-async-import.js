/**
 * 异步导出的模块包含两块内容
 * 03-async-import.js 和 0.js
 *
 * webpackJsonp 用于从异步加载的文件中安装模块
 * 把webpackJsonp挂载到全局是为了方便在其他文件中调用
 *
 */

(function (modules) {
  var installedModules = {};

  // 存储每个 Chunk 的加载状态
  // 键为 Chunk 的 ID，值为 0 代表已经加载成功
  var installedChunks = {
    "03-async-import": 0,
  };

  /**
   * @param chunkIds 异步加载的文件中存放的需要安装的模块对应的 Chunk ID
   * @param moreModules 异步加载的文件中存放的需要安装的模块列表
   * @param executeModules 在异步加载的文件中存放的需要安装的模块都安装成功后，需要执行的模块对应的 index
   */
  function webpackJsonpCallback(data) {
    var chunkIds = data[0]; // [0]
    var moreModules = data[1]; // { './03-async-import/async-child.js': function() { ...., eval(...) } }

    var moduleId,
      chunkId,
      i = 0,
      resolves = [];
    // 把所有 chunkId 对应的模块都标记成已经加载成功
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (
        Object.prototype.hasOwnProperty.call(installedChunks, chunkId) &&
        installedChunks[chunkId]
      ) {
        resolves.push(installedChunks[chunkId][0]);
      }

      // 设置为0, 表示已经加载成功
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    // 上面for循环结束后 modules = {'./03-async-import/async-main.js': fn, './03-async-import/async-child.js': fn}

    if (parentJsonpFunction) parentJsonpFunction(data);

    while (resolves.length) {
      // 此处遍历执行 resolve函数【是在将异步模块的代码添加到modules之后执行】
      resolves.shift()();
    }
  }

  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + "" + ({}[chunkId] || chunkId) + ".js";
  }

  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });

    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    module.l = true;

    return module.exports;
  }

  /**
   * 用于加载被分割出去的，需要异步加载的 Chunk 对应的文件
   * @param chunkId 需要异步加载的 Chunk 对应的 ID
   * @returns {Promise}
   */
  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];

	var installedChunkData = installedChunks[chunkId];

	// 如果加载状态为 0 表示该 Chunk 已经加载成功了，直接返回 resolve Promise
    if (installedChunkData !== 0) {
      if (installedChunkData) {
        promises.push(installedChunkData[2]);
      } else {
        var promise = new Promise(function (resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        // 此时 installedChunkData = [resolve, reject, promise]
        // 此时 installedChunks 的值为 { 0: [resolve, reject, promise], "03-async-import": 0 }
        promises.push((installedChunkData[2] = promise));
        var script = document.createElement("script");
        var onScriptComplete;

        script.charset = "utf-8";
        script.timeout = 120;
        if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
		}
		
		// 文件的路径为配置的 publicPath、chunkId 拼接而成
        script.src = jsonpScriptSrc(chunkId);

        var error = new Error();
        onScriptComplete = function (event) {
          script.onerror = script.onload = null;
          clearTimeout(timeout);
          // ==> chunk = [resolve, reject]
          var chunk = installedChunks[chunkId];
          if (chunk !== 0) {
            if (chunk) {
              var errorType =
                event && (event.type === "load" ? "missing" : event.type);
              var realSrc = event && event.target && event.target.src;
              error.message =
                "Loading chunk " +
                chunkId +
                " failed.\n(" +
                errorType +
                ": " +
                realSrc +
                ")";
              error.name = "ChunkLoadError";
              error.type = errorType;
              error.request = realSrc;
              chunk[1](error); // ==> reject(error)
            }
            installedChunks[chunkId] = undefined;
          }
        };
        var timeout = setTimeout(function () {
          onScriptComplete({ type: "timeout", target: script });
        }, 120000);
		script.onerror = script.onload = onScriptComplete;
		
		// 通过 DOM 操作，往 HTML head 中插入一个 script 标签去异步加载 Chunk 对应的 JavaScript 文件
        document.head.appendChild(script);
      }
    }
    return Promise.all(promises);
  };

  __webpack_require__.m = modules;

  __webpack_require__.c = installedModules;

  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };

  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule)
      return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  __webpack_require__.n = function (module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };

  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  __webpack_require__.p = "./dist/";

  __webpack_require__.oe = function (err) {
    console.error(err);
    throw err;
  };

  // 设置一个全局变量‘webpackJsonp’ 是一个数组
  // 并且该数组的push方法被 webpackJsonpCallback 覆盖, 将数组真正的push方法赋给 parentJsonpFunction
  var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  jsonpArray.push = webpackJsonpCallback;
  jsonpArray = jsonpArray.slice();
  for (var i = 0; i < jsonpArray.length; i++)
    webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction;

  // 调用__webpack_require__函数，传入 moduleId(文件路径)
  return __webpack_require__(
    (__webpack_require__.s = "./03-async-import/async-main.js")
  );
})({
	// 所有没有经过异步加载的，随着执行入口文件加载的模块
  "./03-async-import/async-main.js": function (
    module,
    exports,
    __webpack_require__
  ) {
    eval(
      '__webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./async-child.js */ "./03-async-import/async-child.js")).then(function (sayHello) {\n  console.log(sayHello)\n});\n\n//# sourceURL=webpack:///./03-async-import/async-main.js?'
    );
    // sayHello('async import');
  },
});


/**
 * 按需加载相比常规打包产出结果变化较大，也更加复杂。我们仔细对比其中差异，发现 main.js：
 * * 多了一个 `__webpack_require__.e`
 * * 多了一个 webpackJsonp
 * 
 * 其中 `__webpack_require__.e` 实现非常重要，它初始化了一个 promise 数组，使用 Promise.all() 进行异步插入
 script 脚本；webpackJsonp 会挂在到全局对象 window 上，进行模块安装。
 * 
 * 提取公共代码和异步加载本质上都是前置进行代码分割，再在必要时加载，具体实现可以观察
__webpack_require__.e 和 webpackJsonp
 */
