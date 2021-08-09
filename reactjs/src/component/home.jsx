import React from "react";
import { useHistory } from "react-router-dom";
import Profile from "./profile";
import NavbarUser from "./NavBarUser";
import NavbarAdmin from "./NavBarAdmin";
import SearchCaseUser from "./searchUser";
import SearchCaseAdmin from "./searchAdmin";

const Home = () => {
	const history = useHistory();
	let user_name;
	var user = JSON.parse(localStorage.getItem("users"));
	console.log(user);
	if (user == null) {
		history.push("/");
	}
	if (user != null) {
		user_name = user.user_name;
	}
	if (user.role == "admin") {
		return (
			<div>
				<NavbarAdmin />
				<br />
				<Profile />
				<SearchCaseAdmin />
			</div>
		);
	}
	return (
		<div>
			<NavbarUser />
			<br />
			<Profile />
			<SearchCaseUser />
		</div>
	);
};

export default Home;
