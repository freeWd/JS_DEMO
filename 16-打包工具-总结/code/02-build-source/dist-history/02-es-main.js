 (function(modules) { 
 	var installedModules = {};

 	function __webpack_require__(moduleId) {

 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		module.l = true;

 		return module.exports;
 	}


 	__webpack_require__.m = modules;

 	__webpack_require__.c = installedModules;

 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
 		}
 	};

 	__webpack_require__.r = function(exports) {
 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 		}
 		Object.defineProperty(exports, '__esModule', { value: true });
 	};

 	__webpack_require__.t = function(value, mode) {
 		if(mode & 1) value = __webpack_require__(value);
 		if(mode & 8) return value;
 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
 		var ns = Object.create(null);
 		__webpack_require__.r(ns);
 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
 		return ns;
 	};

 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};

 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

 	__webpack_require__.p = "";


 	return __webpack_require__(__webpack_require__.s = "./02-esmodule/es-main.js");
 })
 ({

 "./02-esmodule/es-child.js":
 (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar sayHello = function sayHello(name) {\n  return \"hello \".concat(name, \" esmodule test\");\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (sayHello);\n\n//# sourceURL=webpack:///./02-esmodule/es-child.js?");

 }),

 "./02-esmodule/es-main.js":

 (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _es_child_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./es-child.js */ \"./02-esmodule/es-child.js\");\n\nconsole.log(Object(_es_child_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])('hello world'));\n\n//# sourceURL=webpack:///./02-esmodule/es-main.js?");

 })

 });


 /**
  * es module 得到的打包主体与之前commonjs打包的内容基本一致
  * 
  * 但是细节上，我们发现 IIFE 传入参数 modules 对象的 value 部分，即执行脚本内容多了以下语句：
  * __webpack_require__.r(__webpack_exports__)
  * 
  * 实际上 `__webpack_require__.r` 这个方法是给模块的 exports 对象加上 ES 模块化规范的标记。
  * 具体标记方式为：如果支持 Symbol 对象，则通过 Object.defineProperty 为 exports 对象的
  * Symbol.toStringTag 属性赋值 Module，这样做的结果是 exports 对象在调用 toString 方法时会返回
  * Module；同时，将 `exports.__esModule` 赋值为 true。 它就是es模块化的标记
  *
  */