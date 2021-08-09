import React from "react";
import "../ApplicationCSS.css";
import Home from "./home";
import UpdateCase from "./updateCase";
import "font-awesome/css/font-awesome.min.css";
import UpdateAccusedComponent from "./accusedUpdate";
import DeleteAccused from "./accusedDelete";
import AddAccused from "./accusedAdd";

class ViewFIRAdmin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			case_info: null,
			show: true,
			accused_data: null,
			caseno: null,
			operation_case: 0,
			accused_info: [{}],
		};
		this.createCardsUI = this.createCardsUI.bind(this);
		this.navfirRef = React.createRef();
	}

	componentDidMount() {
		fetch("http://localhost:80/accused")
			.then((response) => {
				return response.json();
			})
			.then((json) => {
				this.setState({ accused_info: json });
			});

		fetch("http://localhost:80/fir_views_admin")
			.then((response) => {
				//   console.log(response.json());
				return response.json();
			})
			.then((json) => {
				console.log(json);
				this.setState({ case_info: json });
			});
	}

	handleNav = (direction) => {
		if (direction === "left") {
			return this.navfirRef ? (this.navfirRef.current.scrollTop -= 500) : 0;
		} else {
			return this.navfirRef ? (this.navfirRef.current.scrollTop += 500) : null;
		}
	};

	createCardsUI() {
		let data = this.state.case_info,
			accused_data = this.state.accused_info,
			temp;
		if (data == null) return <h3 className="text">No FIRs filed yet!</h3>;

		// console.log(data);
		return data.map((el) => (
			<div className="menu">
				<div className="menu-items" key={el.case_no}>
					<div className="update-btn-style">
						<button
							title="Close Case"
							onClick={() => {
								console.log(el.offence_name);
								this.setState({ caseno: el.case_no });

								this.setState({ show: false });
								this.setState({ operation_case: 1 });
							}}
						>
							<i className="fa fa-lg fa-check-circle"></i>
							Click to Close
						</button>
					</div>
					<h2>
						<i>Case Details:</i>
					</h2>
					Case No: {el.case_no}
					<br />
					FIR date: {el.fir_date}
					<br />
					Complaint By: {el.complaint_by}
					<br />
					Address: {el.address}
					<br />
					Phone No: {el.phone}
					<br />
					Statement: {el.statement}
					<br />
					Case Status: {el.case_status}
					<h4>
						<i>Offence Details:</i>
					</h4>
					Name : {el.offence_name}
					<br />
					IPC section: {el.ipc_section} <br />
					Details: {el.detail}
					<br />
					<div>
						<span>
							<h3>
								<button
									title="add new accused"
									onClick={() => {
										console.log(el.offence_name);
										this.setState({ caseno: el.case_no });

										this.setState({ show: false });
										this.setState({ operation_case: 3 });
									}}
								>
									<i className="fa fa-lg fa-plus"></i>
								</button>
								<i>Accused:</i>
							</h3>
						</span>
					</div>
					{
						(temp = accused_data
							.filter((data) => data.case_no === el.case_no)

							.map((i) => {
								return (
									<div>
										Name: {i.name}{" "}
										<button
											title="delete accused"
											onClick={() => {
												this.setState({ accused_data: i });
												this.setState({ show: false });
												this.setState({ operation_case: 4 });
											}}
										>
											<i className="fa fa-lg fa-trash"></i>
										</button>
										<button
											title="edit accused"
											onClick={() => {
												this.setState({ accused_data: i });
												this.setState({ show: false });
												this.setState({ operation_case: 2 });
											}}
										>
											<i className="fa fa-lg fa-pencil"></i>
										</button>
										<br />
										Age: {i.age}
										<br />
									</div>
								);
							}))
					}
					<br />
				</div>
			</div>
		));
	}

	render() {
		return (
			<div>
				{this.state.show && <Home />}
				{this.state.show && (
					<div className="add-text">
						<h3>Open Cases:</h3>
					</div>
				)}

				{this.state.show && (
					<div className="row-menu">
						<div className="alignment">
							<button onClick={() => this.handleNav("left")} title="Left">
								<i className="fa fa-lg fa-chevron-left"></i>
							</button>
						</div>

						<div className="menu">
							<div className="menu-container" ref={this.navfirRef}>
								{this.createCardsUI()}
							</div>
						</div>
						<div className="alignment">
							<button onClick={() => this.handleNav("right")} title="Right">
								<i className="fa fa-lg fa-chevron-right"></i>
							</button>
						</div>
					</div>
				)}
				{!this.state.show && this.state.operation_case == 1 && (
					<UpdateCase case_no={this.state.caseno} />
				)}
				{!this.state.show && this.state.operation_case == 2 && (
					<UpdateAccusedComponent accused_data={this.state.accused_data} />
				)}
				{!this.state.show && this.state.operation_case == 3 && (
					<AddAccused case_no={this.state.caseno} />
				)}
				{!this.state.show && this.state.operation_case == 4 && (
					<DeleteAccused accused_data={this.state.accused_data} />
				)}
			</div>
		);
	}
}
export default ViewFIRAdmin;
