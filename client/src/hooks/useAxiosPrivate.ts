import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const useAxiosPrivate = () => {
	const refreshFn = useRefreshToken();
	const { auth, logout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const requestInterceptor = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
				}
				return config;
			},
			(err) => {
				return Promise.reject(err);
			}
		);

		const responseInterceptor = axiosPrivate.interceptors.response.use(
			(res) => res,
			async (err) => {
				const prevReq = err?.config;

				if (err?.response?.status === 401 && !prevReq?.sent) {
					prevReq.sent = true;
					try {
						const newAccess = await refreshFn();

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
			axiosPrivate.interceptors.request.eject(requestInterceptor);
			axiosPrivate.interceptors.response.eject(responseInterceptor);
		};
	}, [auth, refreshFn, logout]);

	return axiosPrivate;
};

export default useAxiosPrivate;
