import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ModalProvider } from "./context/ModalProvider";
import { AppContextProvider } from "./context/AppProvider";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	// <React.StrictMode>
	<BrowserRouter>
		<AuthProvider>
			<AppContextProvider>
				<ModalProvider>
					<App />
				</ModalProvider>
			</AppContextProvider>
		</AuthProvider>
	</BrowserRouter>
	// </React.StrictMode>
);
