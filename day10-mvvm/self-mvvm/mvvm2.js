// 写的不熟悉，再联系一遍
class Vue {
    constructor(options) {
        this.$el = this.getElement(options.el);
        this.$data = options.data;
        let computes = options.computed;
        let methods = options.methods;

        if (this.$el) {
            new Observer(this.$data);
            this.setProxy(this.$data);
            this.handleComputes(computes);
            this.handleMethods(methods);
            new Compiler(this.$el, this);
        }
    }

    getElement(el) {
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
            Object.defineProperty(this, key, {
                get() {
                    console.log(key);
                    return methods[key];
                }
            })    
        }
    }

    setProxy(data) {
        for (const key in data) {
            Object.defineProperty(this, key, {
                get() {
                    return data[key];
                },
                set(newValue) {
                    data[key] = newValue;
                }
            });
        }
    }
}

class Compiler {
    constructor(el, vm) {
        this.vm = vm;
        let fragement = this.getFragment(el);
        this.compile(fragement);
        el.appendChild(fragement);

    }

    getFragment(node) {
        let fragement = document.createDocumentFragment();
        let firstChild = null;
        while(firstChild = node.firstChild) {
            fragement.appendChild(firstChild);
        }
        console.log(fragement);
        return fragement;
    }

    compile(node) {
        let childNodes = node.childNodes;
        [...childNodes].forEach(nodeItem => {
            if (nodeItem.nodeType === 1) {
                this.compileElement(nodeItem);
                this.compile(nodeItem);
            } else {
                this.compileText(nodeItem);
            }
        });
    }

    compileElement(node) {
        let attrs = node.attributes;
        [...attrs].forEach(attrItem => {
            let {name, value:expr} = attrItem;
            if (name.startsWith('v-')) {
                let [, directive] = name.split('-');
                let [directiveName, eventName] = directive.split(':');
                CompilerUtil[directiveName](this.vm, node, expr, eventName);
            }
        });
    }

    compileText(node) {
        if (/\{\{\s*(.+)\s*\}\}/g.test(node.textContent)) {
            CompilerUtil.text(this.vm, node, node.textContent);
        }
    }
}


const CompilerUtil = {
    model(vm, node, expr) {
        let value = this.getValue(vm, expr);
        new Watcher(vm, expr, (newValue) => {
            node.value = newValue;
        });
        node.addEventListener('input', (e) =>{
            let newValue = e.target.value;
            handleComputes(function(start, key, index, arr) {
                if (index === arr.length - 1) {
                    start[key] = newValue;
                }
                return start[key];
            }, vm.$data);
            // node.value = newValue;

        });
        node.value = value;
    },

    on(vm, node, expr, eventName) {
        node.addEventListener(eventName, (e) => {
            vm[expr].call(vm, e);
        });
    },

    text(vm, node, expr) {
        let value = expr.replace(/\{\{\s+(.+?)\s+\}\}/g, (...args) => {
            new Watcher(vm, args[1], (newValue) => {
                node.textContent = newValue;
            });
            return this.getValue(vm, args[1]);
        });
        node.textContent = value;
    },

    getValue(vm, expr) {
        return expr.split('.').reduce(function(start, key) {
            return start[key];
        }, vm.$data)
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

    defineReact(data, key, value) {
        this.observer(value);
        let dep = new Dep();

        Object.defineProperty(data, key, {
            get() {
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set: (newValue) => {
                if (newValue !== value) {
                    this.observer(newValue);
                    value = newValue;
                    dep.notify();
                }
            }
        })
    }



}

class Dep {
    constructor() {
        this.dep = []
    }

    addSub(watcher) {
        this.dep.push(watcher);
    }

    notify() {
        this.dep.forEach((depItem) => {
            depItem.update();
        });
    }
}

class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.oldValue = this.getOldValue();
    }

    getOldValue() {
        Dep.target = this;
        let value = CompilerUtil.getValue(this.vm, this.expr);
        Dep.target = null;
        return value;
    }

    update() {
        let newValue =  CompilerUtil.getValue(this.vm, this.expr);
        if (newValue !== this.oldValue) {
            this.cb(newValue);
        }
    }
}
