// 列表 & Key

// 一个元素的 key 最好是这个元素在列表中拥有的一个独一无二的字符串
// key 只是在兄弟节点之间必须唯一


import React from 'react';
import ReactDom from 'react-dom';


// 渲染多个组件
const number = [1,2,3,4,5,6];
const listItems = number.map(numItem => <li>{numItem}</li>)

// ReactDom.render(<ul>{listItems}</ul>, document.getElementById('root'));


// 基础列表组件
function NumberList(props) {
    const numArr = props.number;
    const liArr = numArr.map(numItem => <li key={numItem}>{numItem}</li>);
    return (
        <ul>
            {liArr}
        </ul>
    )
}

// ReactDom.render(<NumberList number={number}/>, document.getElementById('root'));



// ===> 用 key 提取组件
// 元素的 key 只有放在就近的数组上下文中才有意义。
function ListItem(props) {
    return <li>{props.value}</li>
}

function NumberList2(props) {
    const numArr = props.number;
    return (
        <ul>
            { numArr.map(numItem => <ListItem key={numItem.toString()} value={numItem}/>) }
        </ul>
    )
}
ReactDom.render(<NumberList2 number={number}/>, document.getElementById('root'));