import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
// import axios, { axiosPrivate as ap } from "../api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useRefreshToken from "../hooks/useRefreshToken";
interface Post {
	id: number;
	title: string;
	description: string;
	image: string;
	likes: number[];
}

const Posts = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();
	const { auth } = useAuth();
	const refresh = useRefreshToken();
	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchPosts = async () => {
			try {
				// const res = await axios.get("http://127.0.0.1:8000/api/posts", {
				// 	headers: {
				// 		Authorization: `Bearer ${auth.accessToken}`,
				// 		"Content-Type": "application/json",
				// 	},
				// });
				const res = await axiosPrivate.get("/api/posts/", {
					signal: controller.signal,
				});

				// const res = await ap.get("/api/posts/", {
				// 	signal: controller.signal,
				// 	withCredentials: true,
				// 	headers: { Authorization: `Bearer ${auth.accessToken}` },
				// });

				console.log(res.data);
				isMounted && setPosts(res.data);
			} catch (error) {
				console.log("posts fetch err");

				console.error(error);
				navigate("/login", { state: { from: location }, replace: true });
			}
		};
		fetchPosts();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	return (
		<div>
			<button className="text-white" onClick={() => refresh()}>
				Refresh
			</button>
			{posts.length === 0 ? (
				<span className="text-white">No posts yet</span>
			) : (
				posts.map((post, id) => (
					<div className="text-white" key={id}>
						<h3 className="font-bold">{post?.title}</h3>

						<p>{post?.description}</p>

						<div
							className="rounded-md"
							style={{
								width: "300px",
								overflow: "hidden",
								height: "auto",
							}}
						>
							<img
								style={{
									// aspectRatio: "",

									width: "100%",
									objectFit: "cover",
								}}
								src={post.image}
								alt=""
							/>
						</div>

						<div>
							Likes: <span className="font-bold"> {post.likes.length} </span>
						</div>
						<br />
					</div>
				))
			)}
		</div>
	);
};

export default Posts;
