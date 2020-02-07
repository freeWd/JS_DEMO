// 是一种JS和HTML混合的语法,将组件的结构、数据甚至样式都聚合在一起定义组件
// JSX其实只是一种语法糖,最终会通过babeljs转译成createElement语法,以下代码等价

import React from "react";
import ReactDOM from 'react-dom';

const user = {
  firstName: "Harper",
  lastName: "Perez",
  age: 18,
  index: 0
};

function formatName(user) {
  return user.lastName + " " + user.firstName;
}

const names = ['张三','李四','王五'];
const nameArr = [];
for(let i=0;i<names.length;i++){
  nameArr.push(<li>{names[i]}</li>);
}


// 需要注意的是JSX并不是html,在JSX中属性不能包含关键字，像class需要写成className,for需要写成htmlFor,并且属性名需要采用驼峰命名法
const element = (
  <div className="demo-class" tabIndex={user.index} style={{color: 'red'}}>
    <h1>
      Hello, My Name is {formatName(user)}, I'm {user.age} years old
    </h1>
    <ul>
      {nameArr}  
    </ul> 
  </div>
);

ReactDOM.render(element, document.getElementById('root'))
