import React from "react";

export default class AddFishForm extends React.Component {
	createFish = (event) => {
		event.preventDefault();
		const fish = {
			name: this.name.value,
			price: this.price.value,
			status: this.status.value,
			desc: this.desc.value,
			image: this.image.value
		};
		return this.props.addFish(fish);
	};

	render() {
		return (
			<form className="fish-edit"
			      onSubmit={ event => this.createFish(event) }
			      ref={ input => { this.fishForm = input; } }>
				<input ref={ input => { this.name = input; } } type="text" placeholder="Fish Name" />
				<input ref={ input => { this.price = input; } } type="text" placeholder="Fish Price" />
				<select ref={ input => { this.status = input; } }>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea ref={ input => { this.desc = input; } } placeholder="Fish Description" />
				<input ref={ input => { this.image = input; } } type="text" placeholder="Fish Image" />
				<button type="submit">+ Add Item</button>
			</form>
		);
	}

	static propTypes = {
		addFish: React.PropTypes.func.isRequired
	};
}
