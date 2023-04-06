import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const res = await axios.post("/auth/token/refresh/", {
			withCredentials: true,
		});

		setAuth((prev) => {
			console.log(prev);
			console.log(res.data?.access);

			return { ...prev, accessToken: res.data?.access };
		});
	};

	return refresh;
};

export default useRefreshToken;
