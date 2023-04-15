import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Eye from "../icons/Eye";
import axios from "axios";

const USER_REGEX = /^([a-z0-9_]{4,30})$/;
const PASSWORD_REGEX =
	/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])(?=.{8,})[a-zA-Z0-9!@#$%^&*()_+]+$/;

const SignUp = () => {
	const [username, setUsername] = useState("");
	const [validUserName, setValidUsername] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [email, setEmail] = useState("");

	const [password, setPassword] = useState("");
	const [passwordFocus, setPasswordFocus] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [validPassword, setValidPassword] = useState(false);

	const [confirmPassword, setConfirmPassword] = useState("");

	const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
	const [validConfirmPassword, setValidConfirmPassword] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const [errMsg, setErrMsg] = useState("");

	const userNameRef = useRef<HTMLInputElement>(null!);
	const passwordRef = useRef<HTMLInputElement>(null!);
	const confirmPasswordRef = useRef<HTMLInputElement>(null!);

	useEffect(() => {
		if (userNameRef.current) {
			userNameRef.current.focus();
		}
	}, []);

	useEffect(() => {
		setValidUsername(USER_REGEX.test(username));
		setErrMsg("");
	}, [username]);

	useEffect(() => {
		setValidPassword(PASSWORD_REGEX.test(password));
		setValidConfirmPassword(password === confirmPassword);
		setErrMsg("");
	}, [password, confirmPassword]);

	const handleSubmit = async (e: FormEvent) => {
		setIsLoading(true);
		e.preventDefault();
		const verifyUser = USER_REGEX.test(username);
		const verifyPassword = PASSWORD_REGEX.test(password);
		const verifyConfirmPassword = password === confirmPassword;

		// SOme Extra Checks
		if (!username || !password || !email || !confirmPassword) {
			setErrMsg("Please Fill All The Fields");
			return;
		}

		if (!verifyUser) {
			setErrMsg("Invalid Username");
			return;
		}
		if (!verifyPassword) {
			setErrMsg("Invalid Password");
			if (passwordRef.current) passwordRef.current.focus();
			return;
		}
		if (!verifyConfirmPassword) {
			setErrMsg("Passwords Does not match");

			if (confirmPasswordRef.current) confirmPasswordRef.current.focus();
			return;
		}

		const newUser = { username, password, email };

		try {
			const res = await axios.post("/api/auth/register/", newUser);
			setSuccess(true);
			setUsername("");
			setPassword("");
			setConfirmPassword("");
			setEmail("");
			setErrMsg("");
		} catch (error: any) {
			console.log(error);

			if (error?.response?.status === 409) {
				setErrMsg(
					error?.response?.data?.msg || "Username or Email already exist!"
				);
			} else {
				setErrMsg("Something Went wrong please try again");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="text-white min-h-screen px-3 flex justify-center items-center">
			<div
				style={{ maxWidth: "100%", width: "500px" }}
				className="bg-gray-950 bg-opacity-40 rounded px-7 py-4 border-gray-800 border-[1px]"
			>
				<h1 className="font-bold text-xl mb-5 text-center">
					Welcome To Photon :&#41;
				</h1>

				<p className="text-center text-red-500 font-bold tracking-tight text-sm pb-4">
					{errMsg}
				</p>

				{/* Form */}

				{success ? (
					<span className="font-thin">
						Registered SuccessFully Please{" "}
						<Link className=" text-green font-bold" to={"/login"}>
							Login
						</Link>
					</span>
				) : (
					<form onSubmit={handleSubmit} className="flex flex-col gap-6">
						{/* Username */}
						<div className="flex gap-2 flex-col">
							<label
								className="font-bold text-xs text-slate-200"
								htmlFor="username"
							>
								Username
							</label>
							<input
								ref={userNameRef}
								value={username}
								onChange={(e) =>
									setUsername(e.currentTarget.value.toLowerCase())
								}
								className={`bg-transparent border-[1px] border-gray-700 transition-all duration-1000 px-3 py-2 rounded text-white placeholder-slate-500 ${
									!validUserName &&
									userFocus &&
									username &&
									"bg-gradient-to-r from-red-500 to-transparent"
								}`}
								type="text"
								placeholder="Username"
								id="username"
								aria-label="username"
								aria-autocomplete="none"
								autoComplete="off"
								required
								onFocus={() => setUserFocus(true)}
								onBlur={() => setUserFocus(false)}
								aria-invalid={validUserName ? "true" : "false"}
								aria-describedby="user-note"
								name="username"
							/>
							{/* username !== "" && !validUserName && userFocus */}
							<InvalidInfoElement
								id="user-note"
								hidden={username !== "" && !validUserName && userFocus}
							>
								"The username must be between 4 and 30 characters in length and
								may only contain alphanumeric characters and underscores.
								Special characters are not permitted."
							</InvalidInfoElement>
						</div>

						{/* Email */}
						<div className="flex gap-2 flex-col">
							<label
								className="font-bold text-xs text-slate-200"
								htmlFor="email"
							>
								Email
							</label>
							<input
								className="bg-transparent border-[1px] border-gray-700 px-3 py-2 rounded text-white placeholder-slate-500"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.currentTarget.value)}
								placeholder="Email"
								id="email"
								aria-label="username"
								aria-autocomplete="none"
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
							<div className="w-full relative">
								<input
									className={`w-full bg-transparent border-[1px] border-gray-700 transition-all duration-1000 px-3 py-2 rounded text-white placeholder-slate-500 ${
										!validPassword &&
										passwordFocus &&
										password &&
										"bg-gradient-to-r from-red-500 to-transparent text-black"
									}`}
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.currentTarget.value)}
									autoComplete="new-password"
									placeholder="Password"
									id="password"
									aria-label="password"
									required
									onFocus={() => setPasswordFocus(true)}
									onBlur={() => setPasswordFocus(false)}
									aria-invalid={validPassword ? "true" : "false"}
									aria-describedby="password-note"
									name="password"
									ref={passwordRef}
								/>
								{!passwordFocus && (
									<Eye
										active={showPassword}
										className="absolute right-3 top-3 cursor-pointer"
										onClick={() => setShowPassword((prev) => !prev)}
									/>
								)}
							</div>
							<InvalidInfoElement
								id="password-note"
								hidden={password !== "" && !validPassword && passwordFocus}
							>
								8 to 24 characters.
								<br />
								Must include uppercase and lowercase letters, a number and a
								special character.
								<br />
								Allowed special characters:
								<br />
								<span className=" font-bold">!@#$%^&*@&#40;&#41;+_</span>
							</InvalidInfoElement>
						</div>

						{/* Confirm Password  */}

						<div className="flex gap-2 flex-col">
							<label
								className="font-bold text-xs text-slate-200"
								htmlFor="confirm-password"
							>
								Confirm Password
							</label>
							<input
								className={`bg-transparent border-[1px] border-gray-700 transition-all duration-1000 px-3 py-2 rounded text-white placeholder-slate-500 ${
									!validConfirmPassword &&
									confirmPasswordFocus &&
									confirmPassword &&
									"bg-gradient-to-r from-red-500 to-transparent"
								}`}
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.currentTarget.value)}
								autoComplete="new-password"
								placeholder="Confirm Password"
								id="confirm-password"
								aria-label="password"
								required
								name="password"
								onFocus={() => setConfirmPasswordFocus(true)}
								onBlur={() => setConfirmPasswordFocus(false)}
								aria-invalid={validConfirmPassword ? "true" : "false"}
								aria-describedby="confirm-password-note"
								ref={confirmPasswordRef}
							/>

							<InvalidInfoElement
								id="confirm-password-note"
								hidden={
									confirmPassword !== "" &&
									!validConfirmPassword &&
									confirmPasswordFocus
								}
							>
								Passwords does not match
							</InvalidInfoElement>
						</div>

						{/* Submit */}

						<div className="self-center">
							<input
								type="submit"
								value={isLoading ? "Loading... " : "Create Account"}
								className={`
		     bg-green-600
                ${isLoading && "cursor-wait"}
						cursor-pointer px-3 py-2 rounded font-bold hover:bg-green-700 
            disabled:bg-slate-600 disabled:text-gray-400
            transition-all duration-200 ${
							!isLoading && "disabled:cursor-not-allowed"
						}
					
						`}
								disabled={
									!validPassword ||
									!validUserName ||
									!validConfirmPassword ||
									isLoading ||
									email === ""
								}
								aria-label="Create Account"
							/>
						</div>
					</form>
				)}
				<div className="mt-10">
					<span className="text-xs text-gray-400 text-center">
						Already have an account?
						<Link
							className="ml-2 underline hover:text-white transition-color duration-100"
							to="/login"
						>
							Sign in
						</Link>
					</span>
				</div>
			</div>
		</div>
	);
};

export default SignUp;

function InvalidInfoElement({
	children,
	hidden = false,
	id = "",
}: {
	children: React.ReactNode;
	hidden: boolean;
	id?: string;
}) {
	return (
		<p
			id={id}
			className={`${
				hidden ? "block" : "hidden"
			} animate-pulse text-xs text-red-400 transition-all duration-150`}
		>
			{children}
		</p>
	);
}
