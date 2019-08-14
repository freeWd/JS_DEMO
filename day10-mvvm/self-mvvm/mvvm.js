class Vue {
    constructor(options) {
        this.$data = options.data;
        this.$el = this.getElement(options.el);
        let computed = options.computed;
        let methods = options.methods;
        if (this.$el) {
            // 把数据全部转化成Object.defineProperty来定义
            new Observer(this.$data);
            // 把数据获取的操作 vm上的取值操作都代理到vm.$data
            this.proxyVm(this.$data);
            this.handleComputed(computed);
            this.handleMethods(methods);
            new Complier(this.$el, this);
        }
    }

    getElement(el) {
        return el.nodeType === 1 ? el : document.querySelector(el);
    }

    proxyVm(data) {
        for (const key in data) {
            Object.defineProperty(this, key, {
                get() {
                    return data[key];
                },
                set(newValue) {
                    data[key] = newValue;
                }
            })
        }
    }

    handleComputed(computed) {
        for (const key in computed) {
            Object.defineProperty(this.$data, key, {
                get:() => {
                    return computed[key].call(this);
                }
            })
        }
    }

    handleMethods(methods) {
        for (const key in methods) {
            Object.defineProperty(this, key, {
                get() {
                    console.log(key);
                    return methods[key];
                }
            });
        }
    }
}

class Complier {
    constructor(el, vm) {
        this.vm = vm;
        let fragment = this.getFragement(el);
        // 处理html片段
        this.complieDomFrogment(fragment);
        // 将html片段展示出来
        el.appendChild(fragment);
    }

    getFragement(el) {
        let fragment = document.createDocumentFragment();
        let firstChild;
        while(firstChild = el.firstChild) {
            fragment.append(firstChild);
        }
        return fragment;
    }

    complieDomFrogment(node) {
        // 编译内存中的dom节点
        let childNodes = node.childNodes;
        [...childNodes].forEach(childItem => {
            // 节点是
            if (childItem.nodeType === 1) {
                this.complieElement(childItem);
                // 如果是元素就递归继续遍历其子元素，直到是文本为止
                this.complieDomFrogment(childItem);
            } else {
                this.comolieText(childItem);
            }
        });
    }

    complieElement(node) {
        let atts = node.attributes;
        [...atts].forEach(attItem => {
            let {name, value:expr} = attItem;
            // 判断是否是指令 v-model v-html ...
            if (/^v-.+/.test(name)) {
                let [, directive] = name.split('-');
                // console.log(name, directive, expr); // v-on:click on:click test()
                let [directiveName, eventName] = directive.split(':');
                CompileUtil[directiveName](node, expr, this.vm, eventName);
            }
        });
    }

    comolieText(node) {
        if (/\{\{\s*(.+)\s*\}\}/.test(node.textContent)) {
            CompileUtil.text(node, node.textContent, this.vm);
        }
    }
}

const CompileUtil = {
    model(node, expr, vm) {
        // 给 v-mdel的地方加一个被观察对象， 如果后面数据有修改就触发此方法，获取新值给输入框赋值
        new Watcher(vm, expr, (newValue) => {
            node.value = newValue;    
        });
        node.addEventListener('input', (e) => {
            let newValue = e.target.value;
             expr.split('.').reduce(function(data, current, index, arr) {
                if (index === arr.length - 1) {
                    return data[current] = newValue;
                }
                return data[current];
            }, vm.$data);
        });
        let value = this.getValue(vm, expr);
        node.value = value;
    },

    on(node, expr, vm, eventName) {
        // console.log(node, expr, vm, eventName);
        node.addEventListener(eventName, (e) => {
            vm[expr].call(vm, e);
        });
    },

    text(node, expr, vm) {
        let content = expr.replace(/\{\{\s*(.+?)\s*\}\}/g, (...args) => {
            // 给每个文本中的{{xxx}} ==> xxx ==> args[1] 这样的表达式都加上被观察对象
            new Watcher(vm, args[1], (newValue) => {
                console.log(newValue);
                node.textContent = newValue;
            })
            return this.getValue(vm, args[1]);
        });
        node.textContent = content;
    },

    getValue(vm, expr) {
        return expr.split('.').reduce(function(data, current) {
            return data[current];
        }, vm.$data);
    }
}

class Observer {
    constructor(data) {
        this.observer(data);
    }

    observer(data) {
        // 如果是对象才观察
        if (data && typeof data === 'object') {
            // 如果是对象
            for (const key in data) {
                this.defineReact(data, key, data[key]);
            }
        }
    }

    defineReact(obj, key, value) {
        this.observer(value);
        let dep = new Dep(); // 给每一个属性都加上一个具有发布订阅的功能
        Object.defineProperty(obj, key, {
            get() {
                // 创建watcher时，会取到里面的内容，并且把watcher放到全局上
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set: (newVal) => {
                if (newVal !== value) {
                    this.observer(newVal);
                    value = newVal;
                    dep.notify();
                }
            }
        })
    }
}


// 观察对象 （发布订阅） 
class Dep {
    constructor() {
        this.sub = [];
    }

    addSub(watcher) {
        this.sub.push(watcher);
    }

    notify() {
        console.log(this.sub);
        this.sub.forEach(subItem => {
            subItem.update();
        });
    }

}

// 观察者
class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.oldValue = this.get();
    }

    get() {
        Dep.target = this;
        let value = CompileUtil.getValue(this.vm, this.expr);
        Dep.target = null;
        return value;
    }

    update() { // 更新操作， 数据变化后，会调用观察者的update方法
        let newValue = CompileUtil.getValue(this.vm, this.expr);
        if (newValue !== this.oldValue) {
            this.cb(newValue);
        }
    }
}