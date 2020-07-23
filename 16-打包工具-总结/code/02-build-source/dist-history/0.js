/**
 * webpackJsonp属性中push数组
 * push:第一个值 [0] 
 * push:第二个值 对象 { key: value }
 * key是id-即文件路径，value是函数，内部执行async-child.js的代码
 * 
 * ！！webpackJsonp的push函数在mian里面被修改为了webpackJsonpCallback，所以此处是执行webpackJsonpCallback
 */
debugger;
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [0],
  {
    "./03-async-import/async-child.js": function (
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      eval(
        '__webpack_require__.r(__webpack_exports__);\nfunction sayHello(name) {\n  console.log("hello ".concat(name, ", <--- async module"));\n}\n\n/* harmony default export */ __webpack_exports__["default"] = (sayHello);\n\n//# sourceURL=webpack:///./03-async-import/async-child.js?'
      );
    },
  },
]);
