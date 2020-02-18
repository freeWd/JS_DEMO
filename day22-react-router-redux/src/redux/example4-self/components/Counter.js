import React, {Component} from 'react';
import PropTypes from 'prop-types'

export default class Counter extends Component {
    render() {
        const { value, onIncreaseClick } = this.props;
        return (
            <div>
                <h3>{value}</h3>
                <button onClick={onIncreaseClick}>+</button>
            </div>
        )
    }
}

Counter.propTypes = {
    value: PropTypes.number.isRequired,
    onIncreaseClick: PropTypes.func.isRequired
}