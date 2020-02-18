import React from "react";
import ReactDom from "react-dom";

const themes = {
  light: {
    background: "#fff"
  },
  dark: {
    background: "#222"
  }
};

// 创建context, 并设置默认值
// 确保传递给 createContext 的默认值数据结构是调用的组件（consumers）所能匹配的！
const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {}
});

// 用户登录 context
const name = "Guest";
const UserContext = React.createContext({
  name: name
});

// ===========================================================================================

// 挂载在 class 上的 contextType 属性会被重赋值为一个由 React.createContext() 创建的 Context 对象
// 创建后可以使用 this.context 来消费最近 Context 上的那个值
class ThemeButton extends React.Component {
  static contextType = ThemeContext;

  constructor(props, context) {
    super(props);
    console.log(context);
  }

  render() {
    let props = this.props;
    let { theme } = this.context;
    console.log(props);
    console.log(theme);
    return (
      // props中包含 { children: '修改主题', onClick: function }, 将他们传递给button，事件和显示的值才能生效，否则无效
      <button {...props} style={{ backgroundColor: theme.background }}></button>
    );
  }
}

class Toolbar extends React.Component {
  render() {
    return <ThemeButton onClick={this.props.changeTheme}>修改主题</ThemeButton>;
  }
}

// ===========================================================================================

class ThemeButton2 extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme, toggleTheme }) => (
          <button
            onClick={toggleTheme}
            style={{ backgroundColor: theme.background }}
          >
            修改主题2
          </button>
        )}
      </ThemeContext.Consumer>
    );
  }
}

class Toolbar2 extends React.Component {
  render() {
    return <ThemeButton2>修改主题</ThemeButton2>;
  }
}

// ===========================================================================================
// 一个组件可能会消费多个 context
class Content extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <UserContext.Consumer>
            {({ name }) => (
              <div>
                <p>当前主题颜色：{theme.background}</p>
                <p>当前用户名字：{name}</p>
              </div>
            )}
          </UserContext.Consumer>
        )}
      </ThemeContext.Consumer>
    );
  }
}

// ===========================================================================================

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      themeInfo: {
        theme: themes.light,
        toggleTheme: this.toggleTheme
      },
      userInfo: {
        name: name
      }
    };
  }

  toggleTheme = () => {
    this.setState(preState => ({
      themeInfo: {
        ...preState.themeInfo,
        theme:
          preState.themeInfo.theme === themes.dark ? themes.light : themes.dark
      }
    }));
  };

  render() {
    return (
      <div>
        <ThemeContext.Provider value={this.state.themeInfo}>
          <Toolbar changeTheme={this.toggleTheme} />
          <Toolbar2 />

          <UserContext.Provider value={this.state.userInfo}>
            <Content />
          </UserContext.Provider>
        </ThemeContext.Provider>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("root"));
