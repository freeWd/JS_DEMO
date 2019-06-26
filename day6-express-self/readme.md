> 庭有枇杷树，吾妻死之年所手植也，今已亭亭如盖矣 - 《项脊轩志》

了解express的基本用法后，结合前面学习的nodejs的知识，模仿express手写个最基本的山寨版express.
这里没什么新东西要记在readme.md里面，都是前面知识点的整合和使用。
但是对于一些“巧妙”和灵光一闪的地方会记录下来，大概描述为什么这么想，如何想到这么想的。
后面大概率会忘记，记下来就能回头再看看。

在手动写之前，先回忆下express最基本的是使用是如何的：
* 执行express() 用变量app接收返回值
* app的方法中的回调函数涉及到请求和响应的都会比nodejs的createStream的回调函数多一个参数 next -> 用于将请求响应传递到下一个方法中去。
* app.get / post / put / delete 执行方法 参数第一个传递路由路径，第二个传递回调函数。

通过上面的简单描述，我们可以构思下如果要自己去写一个express需要怎么写：
要求如下：
* express是一个函数，返回值是一个对象
* app.listen用于开启监听端口的server，实际上就是在listen函数内部调用了 http.createServe((req, resp) => { ... }).listen(port);
* 回调函数多一个next参数，就是在原生（req, resp） => { ... }外面包一层函数，或者改写原函数

```js
function express() {
    const server = http.createServer((req, resp) => {
       // ... ...
    });

    const app = {
        listen: function(port) {
            server.listen(port);
            if (typeof arguments[1] === 'function') {
                arguments[1]();
            }
        }
    }; 
    return app;
}
```

像上面这样写完貌似要求中的1和2是可以了，但是继续写get等方法和实现和要求3时，会发现写不动了。 不知道从何下手。
问题在于get、post等方法都有（req, resp） => {} 回调函数，并且回调函数中的具体逻辑是客户那边定义的。
原生的nodejs的执行是在 http.createServer的回调函数中执行的。- （触发条件客户端发送请求）

get等方法中无法直接执行回调函数的逻辑，我们可以用一个变量，将数据都缓存起来，每次客户端请求过来的时候，在nodejs原生的回调中根据配置的路径和请求方法，从缓存的数据中找到要执行的函数去执行，这样就解决了上面遇到的问题。

``` js
const server = http.createServer((req, resp) => {
    const { pathname } = url.parse(req.url, true);
    const reqMethod = req.method.toLowerCase();

    app.routes.forEach((routeItem) => {
        if (routeItem.path === pathname && routeItem.method = reqMethod) {
            routeItem.handle(req, resp);
        }
    });
});

const app = {
    routes = [];
    // ...
    get: function(path, callBackFn) {
        let obj = {
            path,
            method: 'get',
            handler: callBackFn
        }
        app.routes.push(obj);
    }
    // ...
}
```

后面的路会越来越难走~

另一个问题马上出来了，调用handle函数的时候，传的是req 和 resp。 但是实际上express里面还带有next, 一但在函数内调用next(),就会携带req, resp信息进入下一个匹配的路由的逻辑中。
比如现在声明了
```js
app.get('/test', (req, resp, next) => {
    // ....
    next();
});

app.all('*', (req, resp, next) => {
    resp.end('end end');
});
```
这时候该怎么办呢？
想一想， 我们既然可以传两个参数（req, resp） 那么也可以传三个参数。 这个问题不好解决的点在于
* 如何判断用户调用了next
* 如果确认了，那么在执行next之后，怎么确认下一个要执行的函数
是的，我们如何知到使用者在使用过程中，什么时候调用了next函数。 我也想不出来，那就看看源码，或者在网上找找看吧。
最后知道了一种很巧妙的方法，如果我们代码内部的逻辑执行的函数就叫next, 如果使用者没有调用自己的next函数，就正常执行逻辑。否则就相当于又一次调用了内部的next函数。

```js
const server = http.createServer((req, resp) => {
    const { pathname } = url.parse(req.url, true);
    const reqMethod = req.method.toLowerCase();

    let index = 0;
    function next() {
        const routeItem = app.routes[i++];
        if (routeItem.path === pathname && routeItem.method = reqMethod) {
            // 匹配到正确的路径就执行回调函数，return的目的是在此结束，不继续执行后面的。
            return routeItem.haneld(req, resp, next);
        }
        // 如果上面没有匹配到就继续递归执行next() 此时index已经 +1，能获取到下一个路径的配置信息
        next();
    }
    next();
});
```





