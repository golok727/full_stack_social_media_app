import React, { createContext, useContext, useReducer } from "react";
import AppReducer, { AppActions } from "../reducers/AppReducer";
import { AppReducerState } from "../reducers/AppReducer";

interface Props {
	children: React.ReactElement | React.ReactElement[];
}

interface AppContextType {
	appState: AppReducerState;
	appDispatch: React.Dispatch<AppActions>;
}

const AppContext = createContext<AppContextType>(null!);

const AppContextProvider: React.FC<Props> = ({ children }) => {
	const [appState, appDispatch] = useReducer(AppReducer, {
		homePosts: [],
		errors: {
			commentDeleteError: "",
			commentPostError: "",
			postError: "",
			serverError: "",
		},
	} satisfies AppReducerState);

	return (
		<AppContext.Provider value={{ appState, appDispatch }}>
			{children}
		</AppContext.Provider>
	);
};

const useApp = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useApp must be used within a ModalProvider context");
	}
	return context;
};

export { AppContextProvider, useApp };
