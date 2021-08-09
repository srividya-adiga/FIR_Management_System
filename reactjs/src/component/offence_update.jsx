import React, { useState } from "react";
import "../ApplicationCSS.css";
import { useHistory } from "react-router-dom";
import Home from "./home";
import { Link } from "react-router-dom";

const Field2 = React.forwardRef(
	({ label, type, placeholder, value }, ref, message) => {
		return (
			<React.Fragment>
				<label>{label}</label>
				<input
					className={message === "" ? "" : "error2"}
					ref={ref}
					type={type}
					placeholder={placeholder}
					defaultValue={value}
				/>
			</React.Fragment>
		);
	}
);
const UpdateComponent = ({ id, offence_name, ipc_section, detail }) => {
	const nameRef = React.useRef();
	const ipcRef = React.useRef();
	const detailRef = React.useRef();
	const history = useHistory();

	// const [iderr, setIdErr] = useState("");
	const [nameerr, setNameErr] = useState("");
	const [ipcerr, setIpcErr] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		let err = true;
		let name_err = false;
		let ipc_err = false;

		const data = {
			id: id.toString(),
			detail: detailRef.current.value,
			ipc_section: ipcRef.current.value,
			offence_name: nameRef.current.value,
		};

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
		if (!name_err && !ipc_err) {
			err = false;
		}
		if (!err) {
			try {
				const response = await fetch("http://localhost:80/offences_update", {
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
							alert("Successfully Updated Offence.");
							console.log(response_data);

							history.push("/offence");
							window.location.reload();
						} else {
							console.log("Internal Issues. Try Again later");
							console.log(response_data);
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
		<div>
			<Home />
			<div className="add-offence">
				<div className="form-group">
					<h3>Update Offence: {id}</h3>
					<div>
						<p className="error">{nameerr}</p>
						<Field2
							ref={nameRef}
							label="Name:"
							type="text"
							value={offence_name}
							placeholder="Enter Offence Name"
							message={nameerr}
						/>
					</div>

					<div>
						<p className="error">{ipcerr}</p>
						<Field2
							ref={ipcRef}
							label="IPC Section:"
							type="text"
							value={ipc_section}
							placeholder="Enter IPC Section"
							message={ipcerr}
						/>
					</div>
					<div>
						<p className="error">{""}</p>
						<Field2
							ref={detailRef}
							label="Detail:"
							type="text"
							value={detail}
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
							Update
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default UpdateComponent;
