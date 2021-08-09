import React from "react";
import "../ApplicationCSS.css";

const DisplaySearch = ({ fir_data, accused_data }) => {
	if (fir_data == null) {
		return (
			<div className="search-display">
				<br />
				<h3 className="text">No Search Result Found!!</h3>
			</div>
		);
	}
	return (
		<div className="search-display">
			<h3>
				<i>
					Search Result: <br />
				</i>
			</h3>

			<div className="search-items">
				<h2>
					<i>Case Details:</i>
				</h2>
				Case No: {fir_data.case_no}
				<br />
				FIR date: {fir_data.fir_date}
				<br />
				Complaint By: {fir_data.complaint_by}
				<br />
				Address: {fir_data.address}
				<br />
				Phone No: {fir_data.phone}
				<br />
				Statement: {fir_data.statement}
				<br />
				Case Status: {fir_data.case_status}
				<h4>
					<i>Offence Details:</i>
				</h4>
				Name : {fir_data.offence_name}
				<br />
				IPC section: {fir_data.ipc_section} <br />
				Details: {fir_data.detail}
				<br />
				<div>
					<span>
						<h3>
							<i>Accused:</i>
						</h3>
					</span>
				</div>
				{accused_data.map((i) => {
					return (
						<div>
							Name: {i.name}
							<br />
							Age: {i.age}
							<br />
						</div>
					);
				})}
				<br />
			</div>
		</div>
	);
};
export default DisplaySearch;
