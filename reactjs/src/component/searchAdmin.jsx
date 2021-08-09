import React, { useState } from "react";
import "../ApplicationCSS.css";
import "font-awesome/css/font-awesome.min.css";
import DisplaySearch from "./displaySearch";

const Field = React.forwardRef(({ type, placeholder, name }, ref) => {
	return (
		<React.Fragment>
			<input className={name} ref={ref} type={type} placeholder={placeholder} />
		</React.Fragment>
	);
});

const SearchCaseAdmin = () => {
	const [fir_data, setFirData] = useState([{}]);
	const [accused_data, setAccusedData] = useState([{}]);
	const [show, setShow] = useState(true);

	const searchRef = React.useRef();
	const validsearch = new RegExp("^[0-9]+$");
	const [nameerr, setNameErr] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		let err = true;
		let name_err = false;

		const caseno = searchRef.current.value;

		if (caseno == "") {
			setNameErr("Enter Case No");
			name_err = true;
		} else if (!validsearch.test(caseno)) {
			setNameErr("Invalid Case Number");
			name_err = true;
		} else {
			setNameErr("");
			name_err = false;
		}

		if (!name_err) {
			err = false;
		}
		if (!err) {
			try {
				const response_fir = await fetch(
					"http://localhost:80/search_fir/" + caseno,
					{
						method: "GET",
					}
				);

				if (response_fir.status >= 200 && response_fir.status < 300) {
					const response_data_fir = await response_fir.json();

					setFirData(response_data_fir);
					// console.log("Data"+response_data_fir);
					try {
						const response = await fetch(
							"http://localhost:80/search_accused/" + caseno,
							{
								method: "GET",
							}
						);
						if (response.status >= 200 && response.status < 300) {
							const response_data = await response.json();
							setAccusedData(response_data);
						}

						setShow(false);
					} catch (err) {
						return err;
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
			<div className="wrap">
				<div className="search">
					<div>
						<Field
							ref={searchRef}
							type="text"
							placeholder="Enter Case Number"
							name="searchTerm"
						/>
						<span className="error">{nameerr}</span>
					</div>

					<button
						className="searchButton"
						type="submit"
						title="search"
						onClick={handleSubmit}
					>
						<i className="fa fa-lg fa-search"></i>
					</button>
				</div>
			</div>
			{!show && (
				<DisplaySearch fir_data={fir_data[0]} accused_data={accused_data} />
			)}
		</React.Fragment>
	);
};

export default SearchCaseAdmin;
