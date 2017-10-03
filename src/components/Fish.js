import React from "react";
import { formatPrice } from "../helpers";

export default class Fish extends React.Component {
	render() {
		const { details, index, addToOrder } = this.props;
		const isAvailable = details.status === "available";
		const buttonText = isAvailable ? "Add to Order" : "Sold Out";
		return (
			<li className="menu-fish">
				<img src={ details.image } alt={ details.name } />
				<h3 className="fish-name">
					{ details.name }
					<span className="price">
						{ formatPrice(details.price) }
					</span>
				</h3>
				<p>{ details.desc }</p>
				<button disabled={ !isAvailable }
				        onClick={ () => addToOrder(index) } >
					{ buttonText }
				</button>
			</li>
		);
	}

	static propTypes = {
		details: React.PropTypes.object.isRequired,
		index: React.PropTypes.string.isRequired,
		addToOrder: React.PropTypes.func.isRequired
	};
}
