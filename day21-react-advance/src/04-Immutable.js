import React, { Component } from "react";
import ReactDom, { render } from "react-dom";
import immutable from 'immutable';

// ====> 模拟ReactDom中的PureComponent的功能
// React.PureComponent 与 React.Component 很相似。两者的区别在于 React.Component 并未实现 shouldComponentUpdate()，而 React.PureComponent 中以浅层对比 prop 和 state 的方式来实现了该函数
class PureComponent extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextStatus) {
    for (const key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (nextProps[key] !== this.props[key]) {
          return true;
        }
      }
    }
    for (const key in nextStatus) {
      if (nextStatus.hasOwnProperty(key)) {
        if (nextStatus[key] !== this.state[key]) {
          return true;
        }
      }
    }
    return false;
  }
}

// ===> 使用shouleComponentUpdate内部的逻辑判断
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 1 };
  }

  // 新状态的值和老状态值不相等的时候才重新渲染，这样能减少render的次数，提高效率
  // 另外没有状态交换的父组件的重新渲染也会导致自组件没有必要的重新渲染
  // 除了自己手写shouldcomponentUpdate之外，还可以使用pureCompnent继承
  // 但是上面的两个方法都有个问题：不可以直接比较Object，会直接true阻止渲染，因为不同的引用指向的其实是对内存中的同一个对象
  // 如果刻意使用深拷贝去比较的话，在对象复杂的情况下也会影响性能
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  addCount = () => {
    this.setState(state => ({ count: state.count + 1 }));
  };

  render() {
    return (
      <button color={this.props.color} onClick={this.addCount}>
        Count: {this.state.count}
      </button>
    );
  }
}
// ReactDom.render(<CounterButton />, document.getElementById("root"));


 
// ===> 复杂数据结构的比较
// 渲染传入的数组值增加了，但是子组件没有重新渲染，因为数组的指针没有变化
class ListOfWords extends React.PureComponent {
  render() {
    console.log('child Compnent render');
    return <div>{this.props.words.join(",")}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ["marklar"]
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ===> 这部分代码很糟，而且还有 bug
    // const words = this.state.words;
    // words.push("marklar");
    // this.setState({ words: words });

    // 避免该问题最简单的方式是避免更改你正用于 props 或 state 的值。例如，上面 handleClick 方法可以用 concat 重写
    this.setState((preState) => (
      {
        words: preState.words.concat(['marklar'])
      }
    ))
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
// ReactDom.render(<WordAdder />, document.getElementById("root"));


// ====> immutable
// PureComponent浅拷贝这样的方法无法判断复杂的数据结构（指针没变）
// 如果完全替换数据中的字段（修改指针），在数据量大的时候性能比较低
// 如果自己写一个类似的PureComponent但是使用了【深拷贝】，在数据结构复杂时性能也会下降
// 为了解决上面提到的所有问题，我们可以使用immutable来更新数据
class Caculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: immutable.Map({nums: 0})
    };
  }

  handleAdd = () => {
    const addNums = this.inputRef.value ? Number(this.inputRef.value) : 0;
    this.setState((preState) => ({
      counter: preState.counter.update('nums', val => val + addNums)
    }))
  }

  shouldComponentUpdate(preProps, preState) {
    if (!immutable.is(preState, this.state)) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div>
        <h1>Sum: {this.state.counter.get('nums')}</h1>
        <input type="number" ref={ref => this.inputRef = ref}/>
        <button onClick={this.handleAdd}>+</button>
      </div>
    )
  }
}

ReactDom.render(<Caculator/>, document.getElementById('root'));


