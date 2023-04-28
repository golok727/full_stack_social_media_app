import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PostsPlaceHolder from "./PostsPlaceHolder";
import Post from "./Post";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useApp } from "../context/AppProvider";
import { AppReducerActions } from "../reducers/AppReducer";

const Posts = () => {
	const axiosPrivate = useAxiosPrivate();
	const location = useLocation();
	const { logout } = useAuth();

	const {
		appState: { homePosts },
		appDispatch,
	} = useApp();

	useEffect(() => {
		useDocumentTitle("Photon");
		let isMounted = true;
		const controller = new AbortController();

		const fetchPosts = async () => {
			try {
				const res = await axiosPrivate.get("/api/posts/", {
					signal: controller.signal,
				});

				isMounted &&
					appDispatch({
						type: AppReducerActions.INIT_POSTS,
						payload: { posts: res.data },
					});
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
				{homePosts.length === 0 ? (
					<div>
						{/* Placeholder for posts before fetching the data */}
						<PostsPlaceHolder />
						<span className="text-white">No posts yet</span>
					</div>
				) : (
					homePosts.map((post, id) => <Post post={post} key={id} />)
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
