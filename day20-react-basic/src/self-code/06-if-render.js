// 条件渲染

// 可以 if 或者条件运算符去创建元素来表现当前的状态，然后让 React 根据它们来更新 UI
// 你可以使用变量来储存元素。 它可以帮助你有条件地渲染组件的一部分
// 你可以使用逻辑与 (&&) 和三目运算符 来进行条件渲染

import React from "react";
import ReactDom from "react-dom";

// 根据条件渲染不同组件
function UserGreeting() {
  return <h1>Welcome Back</h1>;
}

function GuestGreeting() {
  return <h1>Please Login in</h1>;
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  } else {
    return <GuestGreeting />;
  }
}

// 元素变量
// 可以使用变量来储存元素。 它可以帮助你有条件地渲染组件的一部分，而其他的渲染部分并不会因此而改变。
function LoginButton(props) {
  return <button onClick={props.click}>登录</button>;
}

function LogoutButton(props) {
  return <button onClick={props.click}>退出</button>;
}

class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }

  handleLoginClick = () => {
    this.setState(() => ({
      isLoggedIn: true
    }));
  };

  handleLogoutClick = () => {
    this.setState(() => ({
        isLoggedIn: false
    }));
  };

  render() {
    const button = this.state.isLoggedIn ? (
      <LogoutButton click={this.handleLogoutClick} />
    ) : (
      <LoginButton click={this.handleLoginClick} />
    );
    return (
      <div>
        <Greeting isLoggedIn={this.state.isLoggedIn} />
        {button}
      </div>
    );
  }
}


// 与运算符 &&
const messages = ['React', 'Re: React', 'Re:Re: React'];
function MailBox(props) {
    const msgList = props.messages;
    return (
        <div>
            <h1>Hello World,</h1>
            { msgList.length > 0 && 
                <h2>
                    你有 {msgList.length} 条未读的消息
                </h2>
            }
        </div>
    )
}


// 阻止组件渲染
// 在极少数情况下，你可能希望能隐藏组件，即使它已经被其他组件渲染。若要完成此操作，你可以让 render 方法直接返回 null，而不进行任何渲染
function WarningBanner(props) {
    const isShow = props.show;
    if (!isShow) {
        return null;
    }
    return <div style={{color: 'red'}}>Show Warning Msg</div>
}

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    toggleClick = () => {
        this.setState(state => ({
            show: !state.show
        }));
    }

    render() {
        return (
            <div>
                <WarningBanner show={this.state.show}/>
                <button onClick={this.toggleClick}>
                    {this.state.show? '隐藏' : '显示'}
                </button>
            </div>
        )
    }
}

ReactDom.render(<Page/>, document.getElementById("root"));
