import React from "react";
import "../ApplicationCSS.css";
import Home from "./home";

const DeleteAccused = ({ accused_data }) => {
	const handleSubmit = async (e) => {
		const data = {
			case_no: accused_data.case_no,
			name: accused_data.name,
			age: accused_data.age,
		};
		try {
			const response = await fetch("http://localhost:80/accused_delete", {
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
						alert("Successfully Deleted Accused.");
						// console.log(response_data);
						window.location.reload();
					} else {
						alert("Internal Issues. Try Again later");
						window.location.reload();
						// console.log(response_data);
					}
				} catch (ex) {
					console.error(ex);
				}
			} else {
				console.log("Some Error");
				window.location.reload();
			}
		} catch (err) {
			return err;
		}
	};
	handleSubmit();

	return <Home />;
};
export default DeleteAccused;
