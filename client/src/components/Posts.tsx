import axios from "axios";
import { useEffect, useState } from "react";

interface Post {
	id: number;
	title: string;
	description: string;
	image: string;
	likes: number[];
}
const API_BASE = "http://127.0.0.1:8000";

const Posts = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const BASE_URL = "http://127.0.0.1:8000/api/posts/";
				const res = await axios.get(BASE_URL, {});
				const data = res.data;
				setPosts(() => data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchPosts();
	}, []);

	return (
		<div>
			{posts.length === 0 ? (
				<span>No posts yet</span>
			) : (
				posts.map((post, id) => (
					<div key={id}>
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
								src={API_BASE + post.image}
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
