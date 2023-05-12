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
		console.log(
			"%cPhoton",
			"font-weight: bold; color: violet; font-size: 2rem"
		);
		let isMounted = true;

		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (error: any) {
				if (error?.response?.status >= 500) {
					setServerError(true);
					console.log("serverError");
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		if (!auth?.accessToken) {
			verifyRefreshToken();
		} else {
			setIsLoading(false);
		}

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : !auth.accessToken && !auth.user ? (
				serverError ? (
					<div className="text-white">
						Connection to Server Time Out{" "}
						<button onClick={() => window.location.reload()}>
							Click to Reload
						</button>
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
