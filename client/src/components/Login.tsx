import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const userNameRef = useRef<HTMLInputElement>();
	useEffect(() => {
		if (userNameRef.current) {
			userNameRef.current.focus();
		}
	}, []);

	return (
		<div className="min-h-screen text-white flex justify-center items-center ">
			<div className="  bg-gray-950 bg-opacity-40 rounded px-7 py-4 border-gray-800 border-[1px]">
				<h1 className="font-bold text-xl mb-5 text-center">
					Welcome Back :&#41;
				</h1>

				{/* Form */}

				<form className="flex flex-col gap-6">
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
							ref={userNameRef as React.MutableRefObject<HTMLInputElement>}
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
		</div>
	);
};

export default Login;
