import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { AxiosError } from "axios";
const Login = () => {
	const { setAuth, auth } = useAuth();

	const navigate = useNavigate();
	const currLocation = useLocation();
	const from = currLocation.state?.from?.pathname || "/";
	const [isLoading, setIsLoading] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState("");

	const userNameRef = useRef<HTMLInputElement>(null);
	const errRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		if (userNameRef.current) {
			userNameRef.current.focus();
		}
	}, []);

	useEffect(() => {
		setErr("");
	}, [username, password]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const res = await axios.post("/api/auth/login/", { username, password });
			const accessToken = res.data?.access;
			const user = res.data?.user;
			setAuth({ accessToken, user });
			localStorage.setItem("ili", JSON.stringify(true));
			setUsername("");
			setPassword("");
			navigate(from, { replace: true });
		} catch (error: any | AxiosError) {
			if (error.response?.status === 500) {
				setErr("No Server Response");
			} else if (error.response?.status === 401) {
				setErr("Username or Password is incorrect");
			} else {
				setErr("Something Went Wrong!!");
			}

			if (errRef.current) errRef.current.focus();
		} finally {
			setIsLoading(false);
		}
	};

	if (localStorage.getItem("ili")) {
		return <Navigate to={"/"} />;
	}

	return (
		<section className="min-h-screen text-white flex justify-center items-center ">
			<div className="  bg-gray-950 bg-opacity-40 rounded px-7 py-4 border-gray-800 border-[1px]">
				<h1 className="font-bold text-xl mb-5 text-center">
					Welcome Back :&#41;
				</h1>
				<p
					ref={errRef}
					className="text-center text-red-500 font-bold tracking-tight text-sm pb-4"
				>
					{err}
				</p>

				{/* Form */}

				<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
					{/* Username */}
					<div className="flex gap-2 flex-col">
						<label
							className="font-bold text-xs text-slate-200"
							htmlFor="username"
						>
							Username
						</label>
						<input
							className="bg-transparent border-[1px] border-gray-700 px-3 py-2 rounded text-white placeholder-slate-500"
							type="text"
							placeholder="Username"
							ref={userNameRef}
							value={username}
							onChange={(e) => setUsername(e.currentTarget.value)}
							id="username"
							aria-label="username"
							required
							name="username"
						/>
					</div>

					{/* Password  */}

					<div className="flex gap-2 flex-col">
						<label
							className="font-bold text-xs text-slate-200"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="bg-transparent border-[1px] border-gray-700 px-3 py-2 rounded text-white placeholder-slate-500"
							type="password"
							autoComplete="current-password"
							placeholder="Password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.currentTarget.value)}
							aria-label="password"
							required
							name="password"
						/>
					</div>

					{/* Submit */}

					<div className="self-center">
						<input
							type="submit"
							value={isLoading ? "Loading..." : "Login"}
							className={`${
								isLoading ? "bg-green-800" : "bg-green-600"
							} cursor-pointer px-3 py-2 rounded font-bold hover:bg-green-700 ${
								isLoading && "cursor-wait"
							}`}
							aria-label="submit"
							disabled={isLoading}
						/>
					</div>
				</form>

				<div className="mt-10">
					<span className="text-xs text-gray-400 text-center">
						Don&apos;t have an account?
						<Link
							className="ml-2 underline hover:text-white transition-color duration-100"
							to="/signup"
						>
							create one
						</Link>
					</span>
				</div>
			</div>
		</section>
	);
};

export default Login;
