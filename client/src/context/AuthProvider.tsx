import React, { createContext, useState } from "react";
import axios from "axios";
import { useNavigate, Location } from "react-router-dom";

export interface User {
	date_joined: Date;
	email: string;
	first_name: string;
	id: number;
	is_superuser: boolean;
	last_login: Date;
	last_name: string;
	username: string;
}

interface Auth {
	user: User | null;
	accessToken: string;
}

interface AuthenticationContext {
	auth: Auth;
	logout: (location?: Location) => Promise<void>;
	setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}
export const AuthContext = createContext<AuthenticationContext>(null!);

interface Props {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const navigate = useNavigate();

	const [auth, setAuth] = useState<Auth>({
		user: null,
		accessToken: "",
	});

	const logout = async (location?: Location) => {
		setAuth((prev) => ({ ...prev, accessToken: "", user: null }));
		const res = await axios.post("/api/auth/logout/", {
			withCredentials: true,
		});
		if (location) {
			navigate("/login", { state: { from: location }, replace: true });
			return;
		}
		navigate("/");
	};

	return (
		<AuthContext.Provider value={{ auth, setAuth, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
