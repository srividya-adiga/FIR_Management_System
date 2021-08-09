import React from "react";
import Home from "./home";
import { MDBCard } from "mdb-react-ui-kit";
import "../ApplicationCSS.css";
import { Link } from "react-router-dom";
import UpdateComponent from "./offence_update";
import "font-awesome/css/font-awesome.min.css";

class Offence extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			offence_info: null,
			show: true,
			offence_name: null,
			ipc_section: null,
			detail: null,
			id: null,
		};
		this.createCardsUI = this.createCardsUI.bind(this);
	}

	componentDidMount() {
		fetch("http://localhost:80/offences")
			.then((response) => {
				return response.json();
			})
			.then((json) => {
				// console.log(json);
				this.setState({ offence_info: json });
			});
	}

	createCardsUI() {
		let data = this.state.offence_info;
		if (data == null) return <h3 className="text">No offences present yet!</h3>;

		console.log(data);
		return data.map((el) => (
			<div className="card" key={el.id}>
				<div className="update-btn-style">
					<button
						title="edit"
						onClick={() => {
							// console.log(el.offence_name);
							this.setState({
								id: el.id,
								offence_name: el.offence_name,
								ipc_section: el.ipc_section,
								detail: el.detail,
							});

							this.setState({ show: false });
						}}
					>
						<i className="fa fa-lg fa-pencil"></i>
					</button>
				</div>
				<MDBCard
					shadow="0"
					border="dark"
					background="white"
					className="md-3"
					style={{ maxWidth: "18rem" }}
				>
					<div>
						<i>Id:</i> <b>{el.id}</b>{" "}
					</div>
					<div>
						<p className="card-text">
							<i>
								<b>Name: </b>{" "}
							</i>
							<b>{el.offence_name} </b>
							<br />
							<i> IPC section: </i>
							<b>{el.ipc_section} </b>
							<br />
							<i>Details: </i> <b>{el.detail}</b>
						</p>
					</div>
				</MDBCard>
			</div>
		));
	}

	render() {
		return (
			<React.Fragment>
				{this.state.show && <Home />}
				{this.state.show && (
					<div className="add-text">
						<h3>
							<Link to="/offence_add">
								<button title="Add New Accused">
									<i className="fa fa-lg fa-plus"></i>
								</button>
							</Link>
							Offences:
						</h3>
					</div>
				)}
				<div>
					{this.state.show && (
						<div className="row">{this.state.show && this.createCardsUI()}</div>
					)}
					{!this.state.show && (
						<UpdateComponent
							id={this.state.id}
							offence_name={this.state.offence_name}
							ipc_section={this.state.ipc_section}
							detail={this.state.detail}
						/>
					)}
					<div className="add-btn-style"></div>
				</div>
			</React.Fragment>
		);
	}
}
export default Offence;
