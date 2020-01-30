require("../style/style.css");
import { printMe, unUsedFn } from "./print1";

document.querySelector("#app").innerHTML = "<h1>hello world 1234567</h1>";
printMe();

if (false) {
  unUsedFn();
}

// HMR 热更新
if (module.hot) {
  // 默认接收所有文件的代码
  module.hot.accept();

  // 如果明确某个文件，这个文件就无法tree sharking
  // module.hot.accept("./print1.js", function() {
  //   console.log("accept the update printMe module, <-----");
  //   printMe();
  // });
}


// 懒加载模块的导入
document.querySelector('#clickBtn').addEventListener('click',() => {
  import('./lazyload').then(result => {
      console.log(result);
  });
});
