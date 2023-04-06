import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const res = await axiosPrivate.post("/api/auth/token/refresh/");

		setAuth((prev) => {
			console.log(prev);
			console.log(res.data?.access);

			return { ...prev, accessToken: res.data?.access };
		});
	};

	return refresh;
};

export default useRefreshToken;
