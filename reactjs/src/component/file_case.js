import React, { useState } from "react";
import "../ApplicationCSS.css";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Home from "./home";

export const Field = React.forwardRef(
	({ label, type, placeholder }, ref, message) => {
		return (
			<React.Fragment>
				<label>{label}</label>
				<input
					required
					className={message === "" ? "" : "error2"}
					ref={ref}
					type={type}
					placeholder={placeholder}
				/>
			</React.Fragment>
		);
	}
);

const SelectField = React.forwardRef(
	({ label, placeholder, data_offence }, ref) => {
		// console.log(data_offence[0].id);
		return (
			<React.Fragment>
				<label>{label}</label>
				<select ref={ref} placeholder={placeholder}>
					<option value="">--Select a Offence--</option>
					{data_offence.map((i) => {
						return (
							<option key={i.id} value={i.id}>
								{i.offence_name}
							</option>
						);
					})}
				</select>
			</React.Fragment>
		);
	}
);

const FileCase = () => {
	const [offence_data, setOffenceData] = useState([{}]);

	useEffect(() => {
		async function fetchData() {
			const res = await fetch("http://localhost:80/offences");
			res.json().then((json) => {
				console.log(json);
				setOffenceData(json);
			});
		}

		fetchData();
	}, {});

	const fullnameRef = React.useRef();
	const addressRef = React.useRef();
	const phoneRef = React.useRef();
	const offenceTypeRef = React.useRef();
	const statementRef = React.useRef();
	const history = useHistory();
	const validephone = new RegExp("^[0-9]{10}$");
	// console.log(offence_data);
	const [nameerr, setNameErr] = useState("");
	const [addresserr, setAddressErr] = useState("");
	const [phoneerr, setPhoneErr] = useState("");
	const [statementerr, setStatementErr] = useState("");
	const [offenceerr, setOffenceErr] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		let err = true;
		let name_err = false;
		let address_err = false;
		let phone_err = false;
		let statement_err = false;
		let offence_err = false;

		const data = {
			statement: statementRef.current.value,
			phone: phoneRef.current.value,
			offence_type: offenceTypeRef.current.value,
			address: addressRef.current.value,
			case_status: "open",
			complaint_by: fullnameRef.current.value,
		};

		if (data.phone == "") {
			setPhoneErr("Phone Number can't be empty");
			phone_err = true;
		} else if (!validephone.test(data.phone)) {
			setPhoneErr("Invalid Mobile Number");
			phone_err = true;
		} else {
			setPhoneErr("");
			phone_err = false;
		}

		if (data.complaint_by == "") {
			setNameErr("Name can't be empty");
			name_err = true;
		} else {
			setNameErr("");
			name_err = false;
		}
		if (data.statement == "") {
			setStatementErr("Statement can't be empty");
			statement_err = true;
		} else {
			setStatementErr("");
			statement_err = false;
		}
		if (data.offence_type == "") {
			setOffenceErr("Offence Type can't be empty");
			offence_err = true;
		} else {
			setOffenceErr("");
			offence_err = false;
		}
		if (data.address == "") {
			setAddressErr("Address can't be empty");
			address_err = true;
		} else {
			setAddressErr("");
			address_err = false;
		}
		if (
			!name_err &&
			!address_err &&
			!phone_err &&
			!statement_err &&
			!offence_err
		) {
			err = false;
		}
		if (!err) {
			try {
				const response = await fetch("http://localhost:80/file_firs", {
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (response.status >= 200 && response.status < 300) {
					const response_data = await response.json();

					try {
						if (response_data.status_code == 200) {
							alert(
								"Successfully Registered Case. Please Check View FIRs For Updates"
							);

							window.location.reload();
						} else {
							alert("Internal Issues. Try Again later");
							// console.log(response_data);
						}
					} catch (ex) {
						console.error(ex);
					}
				} else {
					console.log("Some Error");
				}
			} catch (err) {
				return err;
			}
		}
	};

	return (
		<React.Fragment>
			<Home />

			<div className="add-case">
				<div className="form-group">
					<h3>File FIR:</h3>
					<span className="error">{nameerr}</span>
					<div>
						<Field
							ref={fullnameRef}
							label="Name:"
							type="text"
							placeholder="Enter Victim Name"
							message={nameerr}
						/>
					</div>

					<div>
						<p className="error">{addresserr}</p>
						<Field
							ref={addressRef}
							label="Address:"
							type="text"
							placeholder="Enter Address"
							message={addresserr}
						/>
					</div>
					<div>
						<p className="error">{phoneerr}</p>
						<Field
							ref={phoneRef}
							label="Mobile Number:"
							type="text"
							placeholder="Enter Mobile Number"
							message={phoneerr}
						/>
					</div>

					<div>
						<p className="error">{statementerr}</p>
						<Field
							ref={statementRef}
							label="Statement:"
							type="textarea"
							placeholder="Enter Statement"
							message={statementerr}
						/>
					</div>
					<div>
						<p className="error">{offenceerr}</p>
						<SelectField
							ref={offenceTypeRef}
							label="Offence Type"
							placeholder="Offence"
							data_offence={offence_data}
						/>
					</div>

					<div>
						<button className="submit" type="submit" onClick={handleSubmit}>
							Submit
						</button>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default FileCase;
