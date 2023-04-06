import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
	const refreshFn = useRefreshToken();
	const { auth } = useAuth();

	useEffect(() => {
		const reqIntercept = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
				}
				return config;
			},
			(err) => Promise.reject(err)
		);

		const resIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (err) => {
				console.log("Err", err);

				return Promise.reject(err);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(reqIntercept);
			axiosPrivate.interceptors.response.eject(resIntercept);
		};
	}, [auth, refreshFn]);

	return axiosPrivate;
};

export default useAxiosPrivate;
