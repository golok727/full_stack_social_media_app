import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
	const { logout } = useAuth();
	return (
		<div className="text-white flex gap-3 items-center justify-between px-4 py-3">
			<div className="flex gap-3">
				<Link to="/">Home</Link>
				<Link to="/create">Create</Link>
				<Link to="/posts">Posts</Link>
				<Link to="/profile">Profile</Link>
			</div>
			<div>
				<button
					className="bg-red-600 px-3 py-2 rounded text-white text-sm font-bold text-center"
					onClick={() => logout()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6 inline-block mx-1"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
						/>
					</svg>
					Logout
				</button>
			</div>
		</div>
	);
};

export default Navbar;
