/**
 * DOM DIFF会产生如下几种情况
 * 1 如果属性发生了变化：{ type: 'ATTR', attrs: { class: 'list-new' } }
 * 2 如果文本发生了变化：{ type: 'TEXT', text: 1 }
 * 3 如果节点被删除了: { type: 'REMOVE', index: 1 }
 * 4 如果节点不一样了: { type: 'REPLACE', newNode: newNode }
 */
import _ from "./util.js";

let patch = {};
let index = 0;

function handleDiff(oldDom, newDom) {
  if (!newDom) {
    patch[index] = _.addPatchRemove(index)
  } else if(_.isString(oldDom) && _.isString(newDom)) {
    if (oldDom !== newDom) {
      patch[index] = _.addPatchText(newDom)
    }
  } else if(oldDom.nodeName !== newDom.nodeName || oldDom.children.length !== newDom.children.length) {
    patch[index] = _.addPatchReplace(newDom)
  } else {
    const attrPatch = handleDiffAttr(oldDom.attrs, newDom.attrs);
    if (attrPatch && Object.keys(attrPatch).length > 0) {
      patch[index] = _.addPatchAttr(attrPatch)
    }
    handleDiffChild(oldDom.children, newDom.children);
  }
}

function handleDiffAttr(oldAttr, newAttr) {
  let attrPatch = {}
  for (const key in oldAttr) {
    // 1 新属性中不存在当前属性 
    // 2 新属性的值变化了
    if (oldAttr[key] !== newAttr[key]) {
      attrPatch[key] = newAttr[key]
    }
  }
  for(const key in newAttr) {
    // 新属性中新增的属性
    if (!oldAttr[key]) {
      attrPatch[key] = newAttr[key]
    }
  }
  return attrPatch;
}

function handleDiffChild(oldChild, newChild) {
  oldChild.forEach((oldItem, i) => {
    handleDiff(oldItem, newChild[i], ++index);
  });
}

export default function diffDom(oldDom, newDom) {
  patch = {};
  index = 0;
  handleDiff(oldDom, newDom);
  return patch;
}
