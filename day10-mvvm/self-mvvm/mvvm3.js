// 如何去构思 双向绑定的问题，
// 1 js里面的数据被修改, 模板的值也会被修改


// 2 模板里面的值被修改，js里面对应绑定的值也被修改
// 给对应的el元素添加监听事件，一但值发生变化，事件触发 修改对应的js里面的值 --- 这个比较好想到

class Vue {
    constructor(options) {
        this.$el = this.parseElement(options.el);
        this.$data = options.data;
        let methods = options.methods;
        let computes = options.computed;
        if (this.$el) {
            new Observer(this.$data);
            this.handleProxy(this.$data);
            this.handleMethods(methods);
            this.handleComputes(computes);
            new Compiler(this.$el, this);
        }
    }

    parseElement(el) {
        return el.nodeType === 1 ? el : document.querySelector(el);
    }

    handleComputes(computes) {
        for (const key in computes) {
            Object.defineProperty(this.$data, key, {
                get: () => {
                    return computes[key].call(this);
                }
            });
        }
    }

    handleMethods(methods) {
        for (const key in methods) {
            if (methods.hasOwnProperty(key)) {
                Object.defineProperty(this, key, {
                    get() {
                        return methods[key];
                    }
                })
            }
        }
    }

    handleProxy(data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                Object.defineProperty(this, key, {
                    get() {
                        return data[key];
                    },
                    set(newValue) {
                        if (newValue !== value) {
                            data[key] = newValue;
                        }
                    }
                })
            }
        }
    }
}

class Observer {
    constructor(data) {
        this.observer(data);
    }

    observer(data) {
        if (data && typeof data === 'object') {
            for (const key in data) {
                this.defineReact(data, key, data[key]);
            }
        }
    }

    defineReact(obj, key, value) {
        this.observer(value);
        let subject = new Subject();
        Object.defineProperty(obj, key, {
            get() {
                if (Subject.target) {
                    subject.addWatcher(Subject.target);
                }
                return value;
            },
            set: (newValue) => {
                if (newValue !== value) {
                    this.observer(newValue);
                    value = newValue;
                    subject.notify();
                }
            }
        })
    }
}

class Compiler {
    constructor(el, vm) {
        this.vm = vm;
        let fragement = this.getFragement(el);
        this.parseFragment(fragement);
        el.appendChild(fragement);
    }

    parseFragment(node) {
        let childNode = node.childNodes;
        [...childNode].forEach(nodeItem => {
            if (nodeItem.nodeType === 1) {
                this.compileElement(nodeItem);
                this.parseFragment(nodeItem);
            } else {
                this.compileText(nodeItem);
            }
        });
    }

    compileElement(node) {
        let attrs = node.attributes;
        [...attrs].forEach(attrItem => {
            let {
                name,
                value: expr
            } = attrItem;
            if (name.startsWith('v-')) {
                let [, directive] = name.split('-');
                let [directiveName, eventName] = directive.split(':');
                CompileUtils[directiveName](node, expr, this.vm, eventName);
            }
        });
    }

    compileText(node) {
        let value = node.textContent;
        if (/\{\{\s+(.+)\s+\}\}/.test(value)) {
            CompileUtils.text(node, value, this.vm);
        }
    }


    getFragement(el) {
        let fragement = document.createDocumentFragment();
        let firstNode;
        while (firstNode = el.firstChild) {
            fragement.appendChild(firstNode);
        }
        return fragement;
    }
}


const CompileUtils = {
    model(node, expr, vm) {
        let value = this.getValue(expr, vm);
        new Watcher(vm, expr, (newValue) => {
            node.value = newValue;
        });
        node.addEventListener('input', (e) => {
            let newValue = e.target.value;
            expr.split('.').reduce(function (data, next, index, arr) {
                if (index === arr.length - 1) {
                    data[next] = newValue;
                }
                return data[next];
            }, vm.$data);
        });
        node.value = value;
    },

    text(node, expr, vm) {
        let value = expr.replace(/\{\{\s+(.+?)\s+\}\}/g, (...args) => {
            new Watcher(vm, args[1], (newValue) => {
                node.textContent = newValue;
            });
            return this.getValue(args[1], vm);
        });
        node.textContent = value;
    },

    on(node, expr, vm, eventName) {
        node.addEventListener(eventName, function () {
            vm[expr].call(vm);
        });
    },


    getValue(expr, vm) {
        return expr.split('.').reduce(function (data, next) {
            return data[next];
        }, vm.$data);
    }
}

// 被观察对象
class Subject {
    constructor() {
        this.subWatcher = [];
    }

    addWatcher(watcher) {
        this.subWatcher.push(watcher);
    }

    notify() {
        this.subWatcher.forEach((watchItem) => {
            watchItem.update();
        });
    }
}

// 观察者
class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.oldValue = this.getOldValue();
    }

    getOldValue() {
        Subject.target = this;
        let value = CompileUtils.getValue(this.expr, this.vm);
        Subject.target = null;
        return value;
    }

    update() {
        let newValue = CompileUtils.getValue(this.expr, this.vm);
        if (newValue !== this.oldValue) {
            this.cb(newValue);
        }
    }
}