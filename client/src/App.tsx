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
					<Route path="/posts" element={<PostsPage />} />
					<Route path="/profile" element={<Profile />} />
				</Route>
				<Route path="/404" element={<NotFound />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</div>
	);
};

export default App;
