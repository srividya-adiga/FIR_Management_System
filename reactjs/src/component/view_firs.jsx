import React from "react";
import "../ApplicationCSS.css";
import Home from "./home";
import "font-awesome/css/font-awesome.min.css";

class ViewFIRS extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			case_info: null,
			show: true,
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

		fetch("http://localhost:80/fir_views")
			.then((response) => {
				return response.json();
			})
			.then((json) => {
				console.log(json);
				this.setState({ case_info: json });
			});
	}

	handleNav = (direction) => {
		if (direction === "left") {
			// console.log(this.navfirRef.current.scrollTop);

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
		return data.map((el) => (
			<div className="menu">
				<div className="menu-items" key={el.case_no}>
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
										Name: {i.name}
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
				<Home />
				<div className="add-text">
					<h3>Filed Cases:</h3>
				</div>

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
			</div>
		);
	}
}
export default ViewFIRS;
