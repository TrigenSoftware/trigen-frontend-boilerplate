import React from 'react';

export default class Clicker extends React.Component {

	state = {
		increment: 0
	};

	render() {
		return (
			<button onClick={this.increment.bind(this)}>
				{this.state.increment}
			</button>
		);
	}

	increment() {
		this.setState({
			increment: this.state.increment + 1
		});
	}
}
