import React from "react";
import ReactDom from "react-dom";

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.inputRef = React.createRef();
  }

  addValue = () => {
    console.log(this.inputRef.current.value);
    this.setState({
      value: this.inputRef.current.value++
    });
  };

  render() {
    return (
      <div>
        <h1>Hello World</h1>
        <input
          type="number"
          ref={this.inputRef}
          defaultValue={this.state.value}
        />
        <button onClick={this.addValue}>+</button>
      </div>
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.childRef = React.createRef();
  }

  handleTest = () => {
    console.log(this.childRef.current.addValue());
    alert(this.childRef.current.inputRef.current.value);
  };

  render() {
    return (
      <div>
        <Child ref={this.childRef} />
        <button onClick={this.handleTest}>Test</button>
      </div>
    );
  }
}

// ReactDom.render(<Parent />, document.getElementById("root"));

// ------
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton" onClick={props.clickEvent}>
    {props.children}
  </button>
));

class RefTest extends React.Component {
    constructor(props){
        super(props);
        this.btnRef = React.createRef();
    }
    handleTest = () => {
        console.log(this.btnRef);
    }
    render() {
        return (
            <div>
              <FancyButton ref={this.btnRef} clickEvent={this.handleTest}>Click me!</FancyButton>
            </div>
        );
    }
}

ReactDom.render(<RefTest />, document.getElementById("root"));
