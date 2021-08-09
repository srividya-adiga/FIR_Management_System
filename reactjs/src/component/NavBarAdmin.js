import React from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Nav, NavLink, Bars, NavMenu, NavBtn } from "./NavBarElements";
import "../ApplicationCSS.css";

const logout = (history) => async (dispatch) => {
	try {
		console.log("Logout Called");
		await axios.post("http://localhost:80/logout");
		localStorage.removeItem("users");
		history.push("/");
	} catch (error) {
		console.log(error);
	}
};

const NavbarAdmin = () => {
	const history = useHistory();
	let user_name;
	var user = JSON.parse(localStorage.getItem("users"));
	if (user != null) {
		user_name = user.user_name;
	}
	return (
		<>
			<Nav>
				<Bars />
				<h2 className="text">Welcome, {user_name}! </h2>
				<NavMenu>
					<NavLink to="/view_fir_admin" activeStyle>
						View FIRS
					</NavLink>
					<NavLink to="/add_admin" activeStyle>
						Add Admin
					</NavLink>
					<NavLink to="/offence" activeStyle>
						Offences
					</NavLink>

					<NavBtn className="logout" onClick={logout(history)}>
						Logout
					</NavBtn>
				</NavMenu>
			</Nav>
		</>
	);
};

export default NavbarAdmin;
