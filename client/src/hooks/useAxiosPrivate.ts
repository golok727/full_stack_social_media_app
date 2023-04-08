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
			(res) => res,
			async (err) => {
				const prevRequest = err?.config;

				if (err?.response?.status === 401 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refreshFn();
					prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
					return axiosPrivate(prevRequest);
				}
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
