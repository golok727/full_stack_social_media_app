import CreatePost from "./components/CreatePost";
import Posts from "./components/Posts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import PostsPage from "./pages/PostsPage";
import PrivateRoute from "./utils/PrivateRoutes";
import Profile from "./pages/Profile";
import useAuth from "./hooks/useAuth";
const App = () => {
	const { auth } = useAuth();
	return (
		<div className="App">
			<BrowserRouter>
				{auth.user && <Navbar />}
				<Routes>
					<Route path="" element={<PrivateRoute />}>
						<Route path="" element={<Posts />} />
						<Route path="/create" element={<CreatePost />} />
						<Route path="/posts" element={<PostsPage />} />
						<Route path="/profile" element={<Profile />} />
					</Route>
					<Route path="/login" element={<Login />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
