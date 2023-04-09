import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
	const { logout } = useAuth();
	return (
		<div className="text-white flex gap-3">
			<Link to="/">Home</Link>
			<Link to="/create">Create</Link>
			<Link to="/posts">Posts</Link>
			<Link to="/profile">Profile</Link>
			<button
				className="bg-red-400 px-3 py-2 rounded text-white"
				onClick={() => logout()}
			>
				Logout
			</button>
		</div>
	);
};

export default Navbar;
