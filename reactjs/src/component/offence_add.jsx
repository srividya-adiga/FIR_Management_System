import React, { useState } from "react";
import "../ApplicationCSS.css";
import { useHistory } from "react-router-dom";
import Home from "./home";
import { Link } from "react-router-dom";
const Field = React.forwardRef(({ label, type, placeholder }, ref, message) => {
	return (
		<React.Fragment>
			<label>{label}</label>
			<input
				className={message === "" ? "" : "error2"}
				ref={ref}
				type={type}
				placeholder={placeholder}
			/>
		</React.Fragment>
	);
});

const Offence_Add = () => {
	const nameRef = React.useRef();
	const idRef = React.useRef();
	const ipcRef = React.useRef();
	const detailRef = React.useRef();
	const history = useHistory();
	const valideid = new RegExp("^[0-9]+$");

	const [iderr, setIdErr] = useState("");
	const [nameerr, setNameErr] = useState("");
	const [ipcerr, setIpcErr] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		let err = true;
		let id_err = false;
		let name_err = false;
		let ipc_err = false;

		const data = {
			id: idRef.current.value,
			detail: detailRef.current.value,
			ipc_section: ipcRef.current.value,
			offence_name: nameRef.current.value,
		};
		if (data.id == "") {
			setIdErr("Id can't be empty");
			id_err = true;
		} else if (!valideid.test(data.id)) {
			setIdErr("Invalid Id (Use numbers only)");
			id_err = true;
		} else {
			setIdErr("");
			id_err = false;
		}

		if (data.offence_name == "") {
			setNameErr("Offence Name can't be empty");
			name_err = true;
		} else {
			setNameErr("");
			name_err = false;
		}
		if (data.ipc_section == "") {
			setIpcErr("IPC Section can't be empty");
			ipc_err = true;
		} else {
			setIpcErr("");
			ipc_err = false;
		}
		if (!id_err && !name_err && !ipc_err) {
			err = false;
		}
		if (!err) {
			try {
				const response = await fetch("http://localhost:80/offences_add", {
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
							// console.log(response_data);
							alert("Successfully Added Offence.");

							// window.location.reload();
							history.push("/offence");
						} else if (response_data.status_code == 401) {
							alert(
								"Offence Id Already Added. Try different or Update Existing"
							);
							// console.log(response_data);
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

			<div className="add-offence">
				<div className="form-group">
					<h3>Add Offence:</h3>
					<span className="error">{iderr}</span>
					<div>
						<Field
							ref={idRef}
							label="Id:"
							type="text"
							placeholder="Enter Offence Id"
							message={iderr}
						/>
					</div>
					<div>
						<p className="error">{nameerr}</p>
						<Field
							ref={nameRef}
							label="Name:"
							type="text"
							placeholder="Enter Offence Name"
							message={nameerr}
						/>
					</div>

					<div>
						<p className="error">{ipcerr}</p>
						<Field
							ref={ipcRef}
							label="IPC Section:"
							type="text"
							placeholder="Enter IPC Section"
							message={ipcerr}
						/>
					</div>
					<div>
						<p className="error">{""}</p>
						<Field
							ref={detailRef}
							label="Detail:"
							type="text"
							placeholder="Enter Details"
							message={""}
						/>
					</div>

					<div>
						<Link to="/offence">
							<button className="cancel" type="submit" onClick>
								Close
							</button>
						</Link>

						<button
							className="submit_password"
							type="submit"
							onClick={handleSubmit}
						>
							Add Offence
						</button>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Offence_Add;
