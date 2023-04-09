import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PostsPlaceHolder from "./PostsPlaceHolder";
import Post from "./Post";
import { PostType } from "../utils/types";

const Posts = () => {
	const [posts, setPosts] = useState<PostType[]>([]);
	const axiosPrivate = useAxiosPrivate();
	const location = useLocation();
	const { auth, logout } = useAuth();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchPosts = async () => {
			try {
				const res = await axiosPrivate.get("/api/posts/", {
					signal: controller.signal,
				});
				//
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
		<div className="container mx-auto max-w-6xl pt-20 pb-10">
			<div className="flex flex-col items-center gap-4">
				{posts.length === 0 ? (
					<div>
						<PostsPlaceHolder />
						<span className="text-white">No posts yet</span>
					</div>
				) : (
					posts.map((post, id) => <Post post={post} key={id} />)
				)}
			</div>
		</div>
	);
};

export default Posts;

// <div className="text-white" key={id}>
// <h3 className="font-bold">{post?.title}</h3>

// <p>{post?.description}</p>

// <div
// 	className="rounded-md"
// 	style={{
// 		width: "300px",
// 		overflow: "hidden",
// 		height: "auto",
// 	}}
// >
// 	<img
// 		style={{
// 			// aspectRatio: "",

// 			width: "100%",
// 			objectFit: "cover",
// 		}}
// 		src={post.image}
// 		alt=""
// 		loading="lazy"
// 	/>
// </div>

// <div>
// 	Likes: <span className="font-bold"> {post.likes.length} </span>
// </div>
// <br />
// </div>
