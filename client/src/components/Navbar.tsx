import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<div className="text-white flex gap-3">
			<Link to="/">Home</Link>
			<Link to="/create">Create</Link>
			<Link to="/posts">Posts</Link>
			<Link to="/profile">Profile</Link>
		</div>
	);
};

export default Navbar;
