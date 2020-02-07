import React from 'react';
import ReactDOM from 'react-dom';


// React DOM 首先会比较元素内容先后的不同，而在渲染过程中只会更新改变了的部分。
// 即便我们每秒都创建了一个描述整个UI树的新元素，React DOM 也只会更新渲染文本节点中发生变化的内容
function updTime() {
    const element =  (
        <div>
            <h1>当前时间是</h1>
            <span>Date: {new Date().toLocaleString()}</span>
        </div>
    );
    ReactDOM.render(element, document.getElementById('root'))
}

setInterval(updTime, 1000);