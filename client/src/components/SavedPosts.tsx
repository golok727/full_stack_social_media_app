import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { numberFormatter } from "../utils/utils";
import SpinnerLoader from "./SpinnerLoader";
import { Link } from "react-router-dom";
import { AvatarMakerSmall } from "../pages/PostPage";

const SavedPosts = () => {
	const axiosPrivate = useAxiosPrivate();
	const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchPostsByUser = async () => {
			try {
				const res = await axiosPrivate.get(`/api/posts/saved/`, {
					signal: controller.signal,
				});
				isMounted && setSavedPosts(() => res.data);
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
	) : savedPosts && savedPosts.length > 0 ? (
		<div className="flex justify-center flex-wrap gap-4 max-w-6xl">
			{savedPosts.map((savedPost, idx) => (
				<Link to={`/p/${savedPost.post.id}`} key={idx}>
					<MiniSavedPost savedPost={savedPost} />
				</Link>
			))}
		</div>
	) : (
		// No Posts
		<div className="font-bold text-gray-300">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="w-10 h-10 inline-block mx-2"
			>
				<path
					fillRule="evenodd"
					d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z"
					clipRule="evenodd"
				/>
			</svg>

			<span>No posts saved yet</span>
		</div>
	);
};
export function MiniSavedPost({ savedPost }: { savedPost: SavedPost }) {
	return (
		<div className="group w-[10em] md:w-[20em] aspect-square overflow-hidden bg-gray-900 relative cursor-pointer">
			<img
				className="w-full h-full object-cover"
				src={savedPost.post.image}
				alt={savedPost.post.title}
			/>
			<div className="absolute inset-0 bg-black bg-opacity-50 transition-all hidden group-hover:flex justify-center items-center">
				<div className="flex gap-2 items-center absolute top-3 left-3 bg-black py-1 px-2 rounded-full">
					<AvatarMakerSmall
						avatar={savedPost.post.user.userprofile.profile_image}
						username={"U"}
					/>

					<span className="font-bold">By @{savedPost.post.user.username}</span>
				</div>
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
						<span>{numberFormatter(savedPost.post.likes_count)}</span>
						{/* Comments */}
					</div>
				</div>
			</div>
		</div>
	);
}
export default SavedPosts;
