// // /html/body/div[2]/ul/li[2]
// 用户行为分析，获取用户的点击（或更多操作）页面的流程和顺序

class Behavior {
  static init(callBackFn) {
    document.addEventListener(
      "click",
      (e) => {
        const xpath = Util.getXPath(e.target);
        console.log("xpath", xpath);
      },
      false
    );
  }
}

const Util = {
  getXPath(ele) {
    if (!(ele instanceof Element)) {
      return;
    }

    if (ele.nodeType !== 1) {
      return;
    }

    const rootEle = document.body;
    if (ele === rootEle) {
      return;
    }

    let xpath = "";
    let childIndex = (ele) => {
      let parent = ele.parentNode;
      let children = Array.prototype.slice
        .call(parent.childNodes)
        .filter((_) => _.nodeType === 1);
      let i = 0;
      for (let _i = 0, len = children.length; _i < len; _i++) {
        if (children[_i] === ele) {
          i = _i;
          break;
        }
      }
      return i === 0 ? "" : "[" + i + "]";
    };

    while (ele !== document) {
      let tag = ele.tagName.toLocaleLowerCase();
      let eleIndex = childIndex(element);
      xpath = "/" + tag + eleIndex + xpath;
      ele = ele.parentNode;
    }
    return xpath;
  },
};


export default Behavior;