// 状态提升
// 通常，多个组件需要反映相同的变化数据，这时我们建议将共享状态提升到最近的共同父组件中去。让我们看看它是如何运作的。

// 构建一个简单的摄氏度和华氏度的转化

import React from "react";
import ReactDom from "react-dom";

const scaleNames = {
  c: "Celsius",
  f: "Fahrenheit"
};

function toCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input) || input === "" || input === null) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded;
}

function BoilingVerdict(props) {
  const celsius = props.celsius;
  return celsius > 100 ? <p>水已经沸腾</p> : <p>水还未沸腾</p>;
}

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange = e => {
    this.props.changeEvent(e.target.name, e.target.value);
  };

  render() {
    const type = this.props.type;
    const value = this.props.value;

    return (
      <div>
        <label>Enter temperature in {scaleNames[type]}</label>
        <input
          type="number"
          name={type}
          value={value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "c",
      value: ''
    };
  }

  updateInput = (type, value) => {
    this.setState({
      type,
      value
    });
  };

  render() {
    const type = this.state.type;
    const value = this.state.value;
    const celsiusValue = type === "c" ? value : tryConvert(value, toCelsius);
    const fahrenheitValue =
      type === "f" ? value : tryConvert(value, toFahrenheit);

    return (
      <div>
        <TemperatureInput
          type="c"
          value={celsiusValue}
          changeEvent={this.updateInput}
        />
        <TemperatureInput
          type="f"
          value={fahrenheitValue}
          changeEvent={this.updateInput}
        />
        <BoilingVerdict celsius={celsiusValue}/>
      </div>
    );
  }
}

ReactDom.render(<Calculator/>, document.getElementById('root'));
