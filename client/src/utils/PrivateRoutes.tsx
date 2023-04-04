import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes: React.FC = () => {
	const isAuthenticated = false;

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
