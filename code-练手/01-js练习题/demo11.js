// 写一个深拷贝函数

// 浅拷贝 - 如果对象的属性是引用类型的值，修改拷贝后的变量的属性值，那么会影响原始变量的值
var obj = {
  a: 1,
  b: {
    aa: 1,
    bb: 2
  },
  c: [1, 2, 3]
};

var obj2 = Object.assign({}, obj);

obj2.b.aa = 111;
obj2.c.push(55);

console.log(obj, obj2);

// 深拷贝
function deepClone(object) {
  function loopAttr(object) {
    let tmpObj;
    if (object instanceof Object) {
        tmpObj = {};
    } 
    if (object instanceof Array) {
        tmpObj = [];
    }

    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        let element = object[key];
        if (element instanceof Object || element instanceof Array) {
            element = loopAttr(element);
        }
        if (element instanceof Function) {
            element = new Function(element); 
        }
        tmpObj[key] = element;
      }
    }
    return tmpObj;
  }
  return loopAttr(object);
}

var obj3 = deepClone(obj);
console.log(obj3);


