const _ = {
  ATTR: 'ATTR',
  TEXT: 'TEXT',
  REMOVE: 'REMOVE',
  REPLACE: 'REPLACE',
  ADD: 'ADD',

  addPatchAttr(attrs) {
    return { type: "ATTR", attrs };
  },
  addPatchText(text) {
    return { type: "TEXT", text };
  },
  addPatchRemove(index) {
    return { type: "REMOVE", index };
  },
  addPatchReplace(newNode) {
    return { type: "REPLACE", newNode };
  },

  isString(node) {
    return typeof node === 'string'
  },

  setAttr(element, attrName, attrValue) {
    switch (attrName) {
      case 'style':
        element.style.cssText = attrValue
        break;
      case 'value':
        let tagName = element.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
          element.value = attrValue;
        } else {
          element.setAttribute(attrName, attrValue);
        }
      default:
        element.setAttribute(attrName, attrValue);
        break;
    }
  }
}

export default _