浏览器中的 ES6 module 实现

只需为 script 元素添加 type=module 属性，浏览器就会把该元素对应的内联脚本或外部脚本当成 ECMAScript 模块进行处理。

```js
<script type="module">
  import {addTextToBody} from './utils.js';

  addTextToBody('Modules are pretty cool.');
</script>

// utils.js
export function addTextToBody(text) {
  const div = document.createElement('div');
  div.textContent = text;
  document.body.appendChild(div);
}
```

使用 nomodule 属性向后兼容
```js
<script type="module" src="module.js"></script>
<script nomodule src="fallback.js"></script>
```
支持 type=module 的浏览器将会忽略带有 nomodule 属性的 script 标签。这意味着我们可以为支持模块的浏览器提供模块形式的代码，同时为那些不支持模块的浏览器提供降级处理。



## fetch
Fetch的使用与介绍： https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
```js
// Example POST method implementation:

postData('http://example.com/answer', {answer: 42})
  .then(data => console.log(data)) // JSON from `response.json()` call
  .catch(error => console.error(error))

function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
  .then(response => response.json()) // parses response to JSON
}
```
