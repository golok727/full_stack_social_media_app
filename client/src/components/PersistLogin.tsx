import { Outlet, Navigate } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Loading from "./Loading";

const PersistLogin = () => {
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();
	const { auth } = useAuth();
	const [serverError, setServerError] = useState(false);
	useEffect(() => {
		let isMounted = true;
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (error: any) {
				if (error?.response?.status === 500) {
					setServerError(true);
					console.log("serverError");
				}
			} finally {
				isMounted && setIsLoading(false);
			}
		};

		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : !isLoading && !auth.accessToken && !auth.user ? (
				serverError ? (
					<div className="text-white">
						Server Error{" "}
						<button onClick={() => window.location.reload()}>Reload</button>
					</div>
				) : (
					<Navigate to="/login" />
				)
			) : (
				<Outlet />
			)}
		</>
	);
};

export default PersistLogin;
