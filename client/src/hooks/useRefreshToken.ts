import axios from "axios";
// import axios, { AxiosRequestConfig } from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const res = await axios.post("/api/auth/token/refresh/", {
			withCredentials: true,
		});

		setAuth((prev) => {
			return { ...prev, accessToken: res.data?.access };
		});

		return res.data?.access;
	};

	return refresh;
};

export default useRefreshToken;
