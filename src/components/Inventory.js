import React from "react";
import base from "../base";
import AddFishForm from "./AddFishForm";

export default class Inventory extends React.Component {
	state = {
		uid: null,
		owner: null
	};

	componentDidMount() {
		base.onAuth(user => {
			if (user) {
				this.authHandler(null, { user })
			}
		});
	}

	handleChange = (event, key) => {
		const fish = this.props.fishes[key];
		const updatedFish = { ...fish, [event.target.name]: event.target.value };
		return this.props.updateFish(key, updatedFish);
	};

	logout = () => {
		base.unauth();
		this.setState({
			uid: null
		});
	};

	authenticate = (provider) => {
		base.authWithOAuthPopup(provider, this.authHandler);
	};

	authHandler = (error, authData) => {
		if (error) {
			console.error(error);
			return;
		}

		const storeRef = base.database().ref(this.props.storeId);
		storeRef.once("value", (snapshot) => {
			const data = snapshot.val() || {};
			if (!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				})
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			});
		});
	};

	renderLogin = () => {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your stores' inventory</p>
				<button className="github" onClick={() => this.authenticate("github")}>
					Log in with GitHub
				</button>
			</nav>
		);
	};

	renderInventory = (key) => {
		const fish = this.props.fishes[key];
		const { removeFish } = this.props;
		return (
			<div className="fish-edit" key={ key }>
				<input type="text"
				       name="name"
				       value={ fish.name }
				       placeholder="Fish name"
				       onChange={ event => this.handleChange(event, key) } />
				<input type="text"
				       name="price"
				       value={ fish.price }
				       placeholder="Fish price"
				       onChange={ event => this.handleChange(event, key) } />
				<select  name="status" value={ fish.status } onChange={ event => this.handleChange(event, key) }>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea name="desc"
				          value={ fish.desc }
				          placeholder="Fish desc"
				          onChange={ event => this.handleChange(event, key) } />
				<input type="text"
				       value={ fish.text }
				       name="image"
				       placeholder="Fish image"
				       onChange={ event => this.handleChange(event, key) } />
				<button onClick={ () => removeFish(key) } >Remove Fish</button>
			</div>
		)
	};

	render() {
		const logout = <button onClick={ this.logout }>Log Out!</button>;
		if (!this.state.uid) {
			return <div>{ this.renderLogin() }</div>
		}

		if (this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry, you aren't the owner of this store!</p>
					{ logout }
				</div>
			)
		}

		return (
			<div>
				<h2>Inventory</h2>
				{ logout }
				{ Object.keys(this.props.fishes).map(this.renderInventory) }
				<AddFishForm addFish={ this.props.addFish } />
				<button onClick={ this.props.loadSamples } >Load Sample Fishes</button>
			</div>
		);
	}

	static propTypes = {
		fishes: React.PropTypes.object.isRequired,
		addFish: React.PropTypes.func.isRequired,
		updateFish: React.PropTypes.func.isRequired,
		removeFish: React.PropTypes.func.isRequired,
		loadSamples: React.PropTypes.func.isRequired,
		storeId: React.PropTypes.string.isRequired
	};
}
