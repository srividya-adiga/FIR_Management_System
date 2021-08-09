import React from "react";
import "../ApplicationCSS.css";
import Home from "./home";

const UpdateCase = (case_no) => {
	// console.log(case_no.case_no);

	const handleSubmit = async (e) => {
		const data = {
			case_no: case_no.case_no,
		};
		try {
			const response = await fetch("http://localhost:80/case_update", {
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
						alert("Successfully Updated Case.");

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
			}
		} catch (err) {
			return err;
		}
	};
	handleSubmit();

	return <Home />;
};
export default UpdateCase;
