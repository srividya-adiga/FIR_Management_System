import React, { useState } from "react";
import "../ApplicationCSS.css";
import Home from "./home";

export const Field = React.forwardRef(
	({ label, type, placeholder }, ref, message) => {
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
	}
);

const RegisterAdmin = () => {
	const fullnameRef = React.useRef();
	const emailRef = React.useRef();
	const passwordRef = React.useRef();
	const confirmpasswordRef = React.useRef();
	const validemail = new RegExp(
		"^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
	);

	const [nameerr, setNameErr] = useState("");
	const [emailerr, setEmailErr] = useState("");
	const [passworderr, setPasswordErr] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		let err = true;
		let name_err = false;
		let email_err = false;
		let password_err = false;
		const confirmpassword = confirmpasswordRef.current.value;
		const data = {
			email: emailRef.current.value,
			password: passwordRef.current.value,
			role: "admin",
			name: fullnameRef.current.value,
		};
		if (data.email == "") {
			setEmailErr("Email can't be empty");
			email_err = true;
		} else if (!validemail.test(data.email)) {
			setEmailErr("Invalid Email");
			email_err = true;
		} else {
			setEmailErr("");
			email_err = false;
		}

		if (data.name == "") {
			setNameErr("Name can't be empty");
			name_err = true;
		} else {
			setNameErr("");
			name_err = false;
		}
		if (data.password == "") {
			setPasswordErr("Password can't be empty");
			password_err = true;
		} else if (data.password != confirmpassword) {
			setPasswordErr("Password and Confirm Password Not Same");
			password_err = true;
		} else {
			setPasswordErr("");
			password_err = false;
		}
		if (!name_err && !email_err && !password_err) {
			err = false;
		}
		if (!err) {
			try {
				const response = await fetch("http://localhost:80/register", {
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
								"Successfully Registered. Please Login With Credentials To Continue"
							);
							// console.log(response_data);
							window.location.reload();
						} else if (response_data.status_code == 401) {
							alert("Email Already Registered. Login or Check Once Again");
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
					<h3>Register Admin:</h3>
					<span className="error">{nameerr}</span>
					<div>
						<Field
							ref={fullnameRef}
							label="Full Name:"
							type="text"
							placeholder="Enter Full Name"
							message={nameerr}
						/>
					</div>

					<div>
						<p className="error">{emailerr}</p>
						<Field
							ref={emailRef}
							label="Email:"
							type="text"
							placeholder="Enter Email"
							message={emailerr}
						/>
					</div>
					<div>
						<p className="error">{passworderr}</p>
						<Field
							ref={passwordRef}
							label="Password:"
							type="password"
							placeholder="Enter Password"
							message={passworderr}
						/>
					</div>

					<div>
						<Field
							ref={confirmpasswordRef}
							label="Confirm Password:"
							type="password"
							placeholder="Enter Password Again"
							message={passworderr}
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

export default RegisterAdmin;
