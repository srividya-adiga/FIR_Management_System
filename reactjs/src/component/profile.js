import React, { useState } from "react";
import blank_profile from "./blank_profile.png";
import "../ApplicationCSS.css";

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

const Profile = () => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const newpasswordRef = React.useRef();
	const confirmnewpasswordRef = React.useRef();
	const [newpassworderr, setNewPasswordErr] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		let err = true;
		let old_password_err = false;
		let new_password_err = false;
		const confirm_password = confirmnewpasswordRef.current.value;
		const data = {
			new_password: newpasswordRef.current.value,
		};

		if (data.new_password == "") {
			setNewPasswordErr("Password can't be empty");
			new_password_err = true;
		} else if (data.new_password != confirm_password) {
			setNewPasswordErr("Password and Confirm Password Not Same");
			new_password_err = true;
		} else {
			setNewPasswordErr("");
			new_password_err = false;
		}
		if (!old_password_err && !new_password_err) {
			err = false;
		}
		if (!err) {
			try {
				const response = await fetch("http://localhost:80/change_password", {
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
							alert("Successfully Changed Password!");
							handleShow();
							window.location.reload();
							console.log(response_data);
						} else {
							alert("Internal Issues. Try Again later");
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

	if (show) {
		return (
			<div className="modal-wrapper-password">
				<div>
					<span
						onClick={handleClose}
						className="close"
						title="Close Password Change Option"
					>
						&times;
					</span>
				</div>

				<div className="form-group">
					<div>
						<br />
						<h3>Change Password:</h3>

						<br />

						<p className="error">{newpassworderr}</p>
						<Field
							ref={newpasswordRef}
							label="New Password:"
							type="password"
							placeholder="Enter New Password"
							message={newpassworderr}
						/>
					</div>

					<div>
						<Field
							ref={confirmnewpasswordRef}
							label="Confirm New Password:"
							type="password"
							placeholder="Enter New Password Again"
							message={newpassworderr}
						/>
					</div>

					<div>
						<button className="cancel" type="submit" onClick={handleClose}>
							Close
						</button>
						<button
							className="submit_password"
							type="submit"
							onClick={handleSubmit}
						>
							Change Password
						</button>
					</div>
				</div>
			</div>
		);
	}

	const user = JSON.parse(localStorage.getItem("users"));

	if (user == null) {
		return <div>Loading...</div>;
	}

	return (
		<div className="profileStyle">
			<br />
			<h3 className="textStyle">Profile</h3>
			<br />
			<br />
			<img src={blank_profile} alt="Profile Picture" width="150" height="150" />
			<br />
			<br />
			Name: {user.user_name}
			<br />
			Email: {user.email}
			<br />
			<br />
			<button className="buttonStyle" onClick={handleShow}>
				<b>change password</b>
			</button>
		</div>
	);
};

export default Profile;
