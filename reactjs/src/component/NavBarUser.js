import React from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "../ApplicationCSS.css";
import {
	Nav,
	NavLink,
	Bars,
	NavMenu,
	NavBtn,
	NavBtnLink,
} from "./NavBarElements";

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

const NavbarUser = () => {
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
					<NavLink to="/file_fir" activeStyle>
						File FIR
					</NavLink>

					<NavLink to="/view_fir" activeStyle>
						View FIR
					</NavLink>
					<NavBtn className="logout" onClick={logout(history)}>
						Logout
					</NavBtn>
				</NavMenu>
			</Nav>
		</>
	);
};

export default NavbarUser;
