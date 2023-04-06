import React, { createContext, useState } from "react";

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
	setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}
export const AuthContext = createContext<AuthenticationContext>(null!);

interface Props {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const [auth, setAuth] = useState<Auth>({ user: null, accessToken: "" });

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};
