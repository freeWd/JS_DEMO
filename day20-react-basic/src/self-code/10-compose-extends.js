// 组合 & 集成

// 组合 类似于 vue的slot， angular的ng-content

import React from "react";
import ReactDom from "react-dom";

// 我们建议组件使用一个特殊的 children prop 来将他们的子组件传递到渲染结果中
function Test(props) {
  const color = props.color;
  return (
    <div style={{color: color}}>
      <h1>Hello World</h1>
      {props.children}
    </div>
  );
}


function Parent(props) {
    return (
        <Test color="red">
            我是内嵌的内容
        </Test>
    )
}

ReactDom.render(<Parent/>, document.getElementById('root'));
