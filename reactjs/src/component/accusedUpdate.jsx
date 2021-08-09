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
const UpdateAccusedComponent = ({ accused_data }) => {
	const nameRef = React.useRef();
	const ageRef = React.useRef();
	const history = useHistory();
	const valideage = new RegExp("^\d+$");

	const [nameerr, setNameErr] = useState("");
	const [ageerr, setAgeErr] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		let err = true;
		let name_err = false;
		let age_err = false;

		const data = {
			case_no: accused_data.case_no,
			new_name: nameRef.current.value,
			new_age: parseInt(ageRef.current.value, 10),
			old_name: accused_data.name,
			old_age: parseInt(accused_data.age, 10),
		};

		if (data.new_name == "") {
			setNameErr("Name can't be empty");
			name_err = true;
		} else {
			setNameErr("");
			name_err = false;
		}
		
		if (!name_err && !age_err) {
			err = false;
		}
		if (!err) {
			try {
				const response = await fetch("http://localhost:80/accused_update", {
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
							alert("Successfully Updated Accused.");

							history.push("/view_fir_admin");
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
					<h3>Update Accused: {accused_data.case_no}</h3>

					<div>
						<p className="error">{nameerr}</p>
						<Field2
							ref={nameRef}
							label="Name:"
							type="text"
							value={accused_data.name}
							placeholder="Enter Accused Name"
							message={nameerr}
						/>
					</div>

					<div>
						<p className="error">{ageerr}</p>
						<Field2
							ref={ageRef}
							label="Age:"
							type="text"
							value={accused_data.age}
							placeholder="Enter Age"
							message={ageerr}
						/>
					</div>

					<div>
						<Link to="/view_fir_admin">
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
export default UpdateAccusedComponent;
