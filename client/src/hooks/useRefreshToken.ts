import axios from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	const { setAuth, logout } = useAuth();

	const refresh = async () => {
		try {
			const res = await axios.post("/api/auth/token/refresh/", {
				withCredentials: true,
			});

			setAuth((prev) => {
				return { ...prev, accessToken: res.data?.access, user: res.data?.user };
			});

			return res.data?.access;
		} catch (error: any) {
			if (error.response.status >= 400 && error.response.status < 500) {
				console.log("Error");
				logout();

				throw new Error("Token refresh failed");
			}
		}
	};

	return refresh;
};

export default useRefreshToken;
