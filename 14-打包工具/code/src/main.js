require("./style/index.css");
require("./style/index.less");
require("./style/index.scss");
require("bootstrap");

let imgUrl = require("./images/demo3.png");
let img = new Image();
console.log(imgUrl);
img.src = imgUrl;
document.body.appendChild(img);

$("#app").html("APP Tag");

// Option+Shift+A
function readonly(target, key, discriptor) {
  discriptor.writable = false;
}
class Person {
  @readonly PI = 3.14;
}
let p1 = new Person();
p1.PI = 3.15;
console.log(p1);


