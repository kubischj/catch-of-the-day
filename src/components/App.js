import React from "react";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import sampleFishes from "../sample-fishes"
import Fish from "./Fish";
import base from "../base";

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			fishes: {},
			order: {}
		};
		this.addFish = this.addFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		this.removeFish = this.removeFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);
	}

	componentWillMount() {
		this.ref = base.syncState(`${ this.props.params.storeId }/fishes`, {
			context: this,
			state: "fishes"
		});

		const localStorageRef = localStorage.getItem(`order-${ this.props.params.storeId }`);
		if (localStorageRef) {
			this.setState({ order: JSON.parse(localStorageRef) });
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState) {
		return localStorage.setItem(`order-${ this.props.params.storeId }`, JSON.stringify(nextState.order));
	}

	addFish(fish) {
		const fishes = { ...this.state.fishes };
		fishes[`fish-${ Date.now() }`] = fish;
		this.setState({ fishes });
		return this.fishForm.reset();
	}

	updateFish(key, updatedFish) {
		const fishes = { ...this.state.fishes, [key]: updatedFish };
		return this.setState({ fishes });
	}

	removeFish(key) {
		const fishes = { ...this.state.fishes, [key]: null };
		this.setState({ fishes });
	}

	loadSamples() {
		return this.setState({ fishes: { ...this.state.fishes, ...sampleFishes } });
	}

	addToOrder(key) {
		const order = { ...this.state.order };
		order[key] = order[key] + 1 || 1;
		return this.setState({ order });
	}

	removeFromOrder(key) {
		const order = { ...this.state.order, [key]: null };
		this.setState({ order });
	}

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="list-of-fishes">
						{
							Object
								.keys(this.state.fishes)
								.map((key) =>
									{ return <Fish key={ key }
									               details={ this.state.fishes[key] }
									               addToOrder={ this.addToOrder }
									               index={ key } />
								})
						}
					</ul>
				</div>
				<Order fishes={ this.state.fishes }
				       order={ this.state.order }
				       params={ this.props.params }
				       removeFromOrder={ this.removeFromOrder } />
				<Inventory addFish={ this.addFish }
				           loadSamples={ this.loadSamples }
				           fishes={ this.state.fishes }
				           updateFish={ this.updateFish }
				           removeFish={ this.removeFish }
				           storeId={ this.props.params.storeId } />
			</div>
		);
	}
}

App.porpTypes = {
	params: React.PropTypes.object.isRequired
};
