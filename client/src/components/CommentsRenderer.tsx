import React, { useEffect, useReducer, useState } from "react";
import { AvatarMakerSmall } from "../pages/PostPage";
import { Link } from "react-router-dom";
import { BioRenderer } from "../pages/Profile";
import Comment from "./Comment";
import SpinnerLoader from "./SpinnerLoader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
interface Props {
	post: PostType;
	commentsState: CommentReducerState;
	dispatch: React.Dispatch<CommentActions>;
}

const CommentsRenderer: React.FC<Props> = ({
	post,
	dispatch,
	commentsState,
}) => {
	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchComments = async () => {
			try {
				const res = await axiosPrivate.get(`/api/posts/${post.id}/comments`, {
					signal: controller.signal,
				});

				dispatch({
					type: CommentActionTypes.SET_COMMENTS,
					payload: { comments: res.data, isLoading: false },
				});
			} catch (error) {
				// Todo Error Remove
				console.error(error);
				dispatch({
					type: CommentActionTypes.COMMENTS_ERROR,
					payload: { errMsg: "Error fetching comments" },
				});
			}
		};
		fetchComments();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	return (
		<section className="hidden md:block overflow-y-auto h-full px-3">
			{/* Description */}
			<header>
				<div className="py-2 flex gap-2">
					<div>
						<AvatarMakerSmall
							avatar={post.user.userprofile.profile_image}
							username={post.user.username}
						/>
					</div>
					{/* Title and username */}
					<div>
						<div className="flex items-center gap-2">
							<Link to={"/" + post.user.username} className="font-bold">
								{post.user.username}
							</Link>
							{/* Todo Parse the title  */}
							<span className="text-sm">{post.title}</span>
						</div>
					</div>
				</div>
				{/* Des */}
				<div className="px-12 py-2">
					<BioRenderer bio={post.description.split(/\r?\n/)} />
				</div>
			</header>

			{/* Comments */}
			{commentsState.isLoading ? (
				<SpinnerLoader />
			) : commentsState.comments && commentsState.comments.length > 0 ? (
				commentsState.comments.map((comment: CommentType) => (
					<Comment key={comment.id} comment={comment} />
				))
			) : (
				<span className="block w-full text-center py-10 text-sm text-gray-400">
					No Comments Yet
				</span>
			)}
		</section>
	);
};

export default CommentsRenderer;
