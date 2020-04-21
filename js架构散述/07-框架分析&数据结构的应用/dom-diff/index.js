import { createElement } from "./element.js";
import diffDom from './dom-diff.js'
import patchDom from './patch.js'
import _ from './util.js'


// 构建一个虚拟dom对象
let virtualDom1 = createElement(
  "ul",
  {
    class: "test-ul",
  },
  [
    createElement("li", { class: "item" }, ["li-text1"]),
    createElement("li", { class: "item" }, ["li-text2"]),
    createElement("li", { class: "item" }, ["li-text3"])
  ]
);

// 将虚拟dom转化为真实dom, root是一个真实的dom
const root = virtualDom1.render();
document.getElementsByTagName('body')[0].appendChild(root);


// 模拟前面发生变化的虚拟dom
let virtualDom2 = createElement("ul", {
    class: 'test-ul2'
}, [
    createElement('li', { class: "item" }, ['li-text5']),
    createElement('li', { class: "item" }, ['li-text6']),
    createElement('li', { class: "item" }, ['li-text7']),
    createElement('li', { class: "item" }, ['li-text8'])
])

// 比较前后两个dom的差异，生成差异化补丁
const patchs = diffDom(virtualDom1, virtualDom2)
console.log(patchs)


// 根据差异化补丁更新真实的DOM对象
patchDom(root, patchs)