import { Element } from './element.js'
import _ from "./util.js";

let index = 0;
let allPatch = {};

export default function patchDom(root, patch) {
  index = 0;
  allPatch = patch;
  if (patch[index]) {
    changeDom(root, allPatch[index]);
  }
  patchChildDom(root.childNodes);

}

function patchChildDom(nodes) {
  (nodes || []).forEach((nodeItem) => {
    index++;
    changeDom(nodeItem, allPatch[index]);
    patchChildDom(nodeItem.childNodes);
  });
}

function changeDom(node, currentPatch) {
  if (currentPatch) {
    switch (currentPatch.type) {
      case _.ATTR:
        for (const key in currentPatch.attrs) {
          _.setAttr(node, key, currentPatch[key]);
        }
        break;
      case _.TEXT:
        node.textContent = currentPatch.text;
        break;
      case _.REMOVE:
        node.parentNode.removeChild(node);
        break;
      case _.REPLACE:
        let newNode;
        if (currentPatch.newNode instanceof Element) {
          newNode = currentPatch.newNode.render();
        } else {
          newNode = document.createTextNode(currentPatch.newNode);
        }
        node.parentNode.replaceChild(newNode, node);
        break;
      default:
        break;
    }
  }
}
