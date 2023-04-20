import CreatePost from "./components/CreatePost";
import Posts from "./components/Posts";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import PostsPage from "./pages/PostsPage";
import Profile from "./pages/Profile";
import useAuth from "./hooks/useAuth";
import PersistLogin from "./components/PersistLogin";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import PostPage from "./pages/PostPage";
import EditAccount from "./pages/EditAccount";
const App = () => {
	const { auth } = useAuth();
	return (
		<div className="App">
			{auth.user && <Navbar />}
			<Routes>
				<Route path="/" element={<PersistLogin />}>
					<Route path="/" element={<Posts />} />
					<Route path="/:username" element={<Profile />} />
					<Route path="/create" element={<CreatePost />} />
					<Route path="/p" element={<PostsPage />} />
					<Route path="/p/:postId" element={<PostPage />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/account/edit" element={<EditAccount />} />
				</Route>
				<Route path="/404" element={<NotFound />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
			</Routes>
		</div>
	);
};

export default App;
