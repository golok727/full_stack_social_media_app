import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SpinnerLoader from "./SpinnerLoader";
import { numberFormatter } from "../utils/utils";

interface Props {
	username: string;
}
const PostsByUser: React.FC<Props> = ({ username }) => {
	const axiosPrivate = useAxiosPrivate();

	const [postsByUser, setPostsByUser] = useState<PostType[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchPostsByUser = async () => {
			try {
				const res = await axiosPrivate.get(`/api/posts/user/${username}`);
				console.log(res.data.posts);
				if (res.data.posts) {
					setPostsByUser((prev) => [...prev, ...res.data.posts]);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchPostsByUser();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);
	return isLoading ? (
		<SpinnerLoader />
	) : postsByUser && postsByUser.length > 0 ? (
		<div className="flex justify-center flex-wrap gap-4 max-w-6xl">
			{postsByUser.map((post, idx) => (
				<MiniPost post={post} key={idx} />
			))}
		</div>
	) : (
		<span>No posts yet</span>
	);
};

export default PostsByUser;

function MiniPost({ post }: { post: PostType }) {
	return (
		<div className="group w-[10em] md:w-[20em] aspect-square overflow-hidden bg-gray-900 relative cursor-pointer">
			<img
				className="w-full h-full object-cover"
				src={post.image}
				alt={post.title}
			/>
			<div className="absolute inset-0 bg-black bg-opacity-50 transition-all hidden group-hover:flex justify-center items-center">
				<div className="font-bold">
					{/* Likes */}
					<div className="text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-6 h-6 inline-block"
						>
							<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
						</svg>
						<span>{numberFormatter(post.likes_count)}</span>
						{/* Comments */}
					</div>
				</div>
			</div>
		</div>
	);
}
