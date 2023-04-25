import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ModalProvider } from "./context/ModalProvider";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	// <React.StrictMode>
	<BrowserRouter>
		<AuthProvider>
			<ModalProvider>
				<App />
			</ModalProvider>
		</AuthProvider>
	</BrowserRouter>
	// </React.StrictMode>
);
