import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { AxiosError, isAxiosError } from "axios";
const Login = () => {
	const { setAuth } = useAuth();

	const navigate = useNavigate();
	const currLocation = useLocation();
	const from = currLocation.state?.from?.pathname || "/";

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState("Error");

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
		try {
			const res = await axios.post("/api/auth/login/", { username, password });
			const accessToken = res.data?.access;
			const user = res.data?.user;
			setAuth({ accessToken, user });
			setUsername("");
			setPassword("");

			navigate(from, { replace: true });
		} catch (error: any | AxiosError) {
			console.log(err);
			if (isAxiosError(err)) {
				if (!err.response) {
					setErr("No Server Response");
				} else if (err.response?.status === 400) {
					setErr("Username or Password is incorrect");
				} else {
					setErr("Unauthorized");
				}
			} else {
				setErr("Something Went Wrong");
			}

			if (errRef.current) errRef.current.focus();
		}
	};

	return (
		<section className="min-h-screen text-white flex justify-center items-center ">
			<div className="  bg-gray-950 bg-opacity-40 rounded px-7 py-4 border-gray-800 border-[1px]">
				<h1 className="font-bold text-xl mb-5 text-center">
					Welcome Back :&#41;
				</h1>
				<p
					ref={errRef}
					className="text-center text-red-500 font-bold tracking-tight text-sm"
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
							value="Login"
							className="bg-green-600 cursor-pointer px-3 py-2 rounded font-bold "
							aria-label="submit"
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
