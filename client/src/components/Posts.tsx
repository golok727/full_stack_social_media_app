import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
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
	const location = useLocation();
	const { auth, logout } = useAuth();

	const refresh = useRefreshToken();
	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchPosts = async () => {
			try {
				const res = await axiosPrivate.get("/api/posts/", {
					signal: controller.signal,
				});

				isMounted && setPosts(res.data);
			} catch (error: any) {
				if (error?.response?.status === 401) {
					logout(location);
					return;
				}

				console.log(error);
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
