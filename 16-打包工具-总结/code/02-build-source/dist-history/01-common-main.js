// 该文件经过二次处理，将里面的一些注释和符号都去掉，方便阅读

(function (modules) {
  // 缓存已经加载过的内容的对象，防止多次加载的重复执行
  var installedModules = {};

  // ====> require 函数 start
  // 类似commonJs的reuire(), 它是webpack加载函数，用来加载webpack定义的模块，返回exports导出的对象
  function __webpack_require__(moduleId) {
    // 如果缓存对象中存在，直接返回结果
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }

    // 第一次加载时，以moduleId为key，构建一个缓存此key模块的对象
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });

    // 执行模块中的内容
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    // 标记是否已经加载
    module.l = true;

    // 返回模块导出的对象引用
    return module.exports;
  }
  // <==== require 函数 end


  // 将modules赋值给require函数的一个属性，将modules的内容暴露出来
  __webpack_require__.m = modules;

  // 同上，暴露 “模块缓存”
  __webpack_require__.c = installedModules;

  // 定义 exports 对象导出的属性
  __webpack_require__.d = function (exports, name, getter) {
    // 如果exports(不含原型链上)没有[name]属性, 定义该属性的getter
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // 定义一个esModule的exports
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };


  // 这块的内容大致的意思应该是根据判断的不同模式，选择不同的模块加载方案, 具体的含义还不是很清楚后面再看
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
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

  // getDefaultExport函数，用于与非harmony模块兼容
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

  __webpack_require__.p = "";

  // Load entry module and return exports
  return __webpack_require__((__webpack_require__.s = "./common-main.js"));
})(
  {
    "./child.js":
      function (module, exports) {
        eval(
          "module.exports = function (name) {\n    return 'hello ' + name\n}\n\n//# sourceURL=webpack:///./child.js?"
        );
      },

    "./common-main.js":
      function (module, exports, __webpack_require__) {
        eval(
          "const sayHello = __webpack_require__(\"./child.js\")\n\nconsole.log(sayHello('hello world'))\n\n//# sourceURL=webpack:///./common-main.js?"
        );
      },
  }
);



/**
 * COMMONJS 规范打包结果：
 * 
 * ## webpac打包的结构是一个立即执行函数，modules 对象的 key 是依赖路径，value 是经过简单处理后的脚本（它不完全等同于我们编写的业务脚本，而是被 webpack 进行包裹后的内容）。
 * 
 * 
 * ## 打包结果中，定义了一个重要的模块加载函数：__webpack_require__
 * 我们首先使用 `__webpack_require__` 加载函数去加载入口模块 `./src/common-main.js`
 * 加载函数 `__webpack_require__` 使用了闭包变量 installedModules，它的作用是将已加载过的模块结果保存在内存中
 * 
 */