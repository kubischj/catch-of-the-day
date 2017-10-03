import React from "react";
import { Redirect } from "react-router";
import { getFunName } from "../helpers";

export default class StorePicker extends React.Component {
	state = {
		redirect: ""
	};

	goToStore = (event) => {
		event.preventDefault();
		return this.setState({ redirect: <Redirect push to={ `/store/${ this.storeInput.value }` } /> });
	};

	render() {
		return (
			<form className="store-selector" onSubmit={ event => this.goToStore(event) }>
				<h2>Please Enter a Store</h2>
				<input type="text" required placeholder="Store Name"
				       defaultValue={ getFunName() }
				       ref={ input => { this.storeInput = input; } }/>
				<button type="submit">Visit Store ➡</button>
				{ this.state.redirect }
			</form>
		);
	}
}
