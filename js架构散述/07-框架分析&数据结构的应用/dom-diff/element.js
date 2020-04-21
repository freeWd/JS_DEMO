import _ from './util.js'

export class Element {
  constructor(nodeName, attrs, children) {
    this.nodeName = nodeName;
    this.attrs = attrs;
    this.children = children;
  }

  render() {
    let element = document.createElement(this.nodeName);
    for (const key in this.attrs) {
      if (this.attrs.hasOwnProperty(key)) {
        _.setAttr(element, key, this.attrs[key])
      }
    }
    this.children.forEach(childNode => {
      if (childNode instanceof Element) {
        element.appendChild(childNode.render())
      } else {
        element.appendChild(document.createTextNode(childNode))
      }
    });
    return element;
  }
}



export function createElement(nodeName, attrs, children) {
  return new Element(nodeName, attrs, children)
}