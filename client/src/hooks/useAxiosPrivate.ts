import { defineConfig } from "vite";
import { useEffect } from "react";
import axios, { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
	const refreshFn = useRefreshToken();
	const { auth } = useAuth();

	useEffect(() => {
		console.log("Run");
		const requestInterceptor = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
				}
				return config;
			},
			(err) => Promise.reject(err)
		);

		const responseInterceptor = axiosPrivate.interceptors.response.use(
			(res) => res,
			async (err) => {
				const prevReq = err?.config;
				console.log(prevReq?.headers);

				if (err?.response?.status === 401 && !prevReq?.sent) {
					console.log("Res Err");
					prevReq.sent = true;
					try {
						const newAccess = await refreshFn();
						console.log(auth);
						prevReq.headers["Authorization"] = `Bearer ${newAccess}`;
						return axiosPrivate(prevReq);
					} catch (error) {
						return Promise.reject(err);
					}
				}
				return Promise.reject(err);
			}
		);

		return () => {
			console.log("clean");
			axiosPrivate.interceptors.request.eject(requestInterceptor);
			axiosPrivate.interceptors.response.eject(responseInterceptor);
		};
	}, [auth, refreshFn]);

	return axiosPrivate;
};

export default useAxiosPrivate;
