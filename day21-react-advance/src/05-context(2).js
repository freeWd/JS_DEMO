import React from "react";
import ReactDom from "react-dom";

const ThemeContext = React.createContext();

class Title extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ border: `5px solid ${this.context.color}` }}>Title</div>
    );
  }
}

class Header extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ border: `5px solid ${this.context.color}` }}>
        Header
        <Title></Title>
      </div>
    );
  }
}

class Content extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ border: `5px solid ${this.context.color}` }}>
        Content
        <button onClick={this.context.changeColor.bind(this, 'yellow')}>yellow</button>
        <button onClick={this.context.changeColor.bind(this, 'blue')}>blue</button>
      </div>
    );
  }
}

class Main extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ border: `5px solid ${this.context.color}` }}>
        Main
        <Content />
      </div>
    );
  }
}

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "green",
      changeColor: this.changeColor
    };
  }

  changeColor = color => {
    this.setState({
      color
    });
  };

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        <div style={{ border: `5px solid ${this.state.color}`, width: 300 }}>
          page
          <Header />
          <Main />
        </div>
      </ThemeContext.Provider>
    );
  }
}

ReactDom.render(<Panel />, document.getElementById("root"));
