require("../style/style.css");
import printMe from "./print1";

document.querySelector("#app").innerHTML = "<h1>hello world 1234</h1>";
printMe();

if (module.hot) {
  // 默认接收所有文件的代码
  //  module.hot.accept();
  module.hot.accept("./print1.js", function() {
    console.log("accept the update printMe module, <-----");
    printMe();
  });
}
