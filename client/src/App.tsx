import CreatePost from "./components/CreatePost";
import Posts from "./components/Posts";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import useAuth from "./hooks/useAuth";
import PersistLogin from "./components/PersistLogin";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import PostPage from "./pages/PostPage";
import EditAccount from "./pages/EditAccount";
import Tags from "./pages/Tags";
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
					<Route path="/p" element={<Explore />} />
					<Route path="/p/:postId" element={<PostPage />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/account/edit" element={<EditAccount />} />
					<Route path="/explore" element={<Explore />} />
					<Route path="/explore/tags/:tag" element={<Tags />} />
				</Route>
				<Route path="/404" element={<NotFound />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
			</Routes>
		</div>
	);
};

export default App;
