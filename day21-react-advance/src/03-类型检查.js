// 要在组件的 props 上进行类型检查，你只需配置特定的 propTypes 属性
// 您可以通过配置特定的 defaultProps 属性来定义 props 的默认值

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

class Person extends React.Component {
    static defaultProps = {
        name: 'Tom'
    }

    static propType = {
        name: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        gender: PropTypes.oneOf(['male', 'female']),
        hobby: PropTypes.array,
        position: PropTypes.objectOf({
            x: PropTypes.number,
            y: PropTypes.number
        }),
        age(props, propName, componentName) {
            let age=props[propName];
            if (age <0 || age>120) {
                return new Error(`Invalid Prop ${propName} supplied to ${componentName}`)
            }
        }
    }

    render() {
        let { name, age, gender, hobby, position } = this.props;
        return (
            <ul>
                <li>姓名: {name}</li>
                <li>年龄: {age}</li>
                <li>性别: {gender}</li>
                <li>习惯: {hobby.toString()}</li>
                <li>位置: {`(${position.x}, ${position.y})`}</li>
            </ul>
        )
    }
}

let person={
    age: 100,
    gender:'male',
    hobby: ['basketball','football'],
    position: {x: 10,y: 10},
}
ReactDom.render(<Person {...person}/>, document.getElementById('root'));