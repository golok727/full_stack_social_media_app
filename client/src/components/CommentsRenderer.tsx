import React, { useEffect, useState } from "react";
import { AvatarMakerSmall } from "../pages/PostPage";
import { Link } from "react-router-dom";
import { BioRenderer } from "../pages/Profile";
import Comment from "./Comment";
import SpinnerLoader from "./SpinnerLoader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import VerifiedIcon from "../icons/VerifiedIcon";
import {
	CommentActionTypes,
	CommentActions,
	CommentReducerState,
} from "../reducers/CommentsReducer";
import Add from "../icons/Add";
interface Props {
	post: PostType;
	commentsState: CommentReducerState;
	dispatch: React.Dispatch<CommentActions>;
	setReplyToId: React.Dispatch<React.SetStateAction<number | null>>;
	setParentCommentId: React.Dispatch<React.SetStateAction<number | null>>;
	setReplyToUserName: React.Dispatch<React.SetStateAction<string | null>>;
	focusInputRef: () => void;
}
// Todo Refetch comments every 20s
const CommentsRenderer: React.FC<Props> = ({
	post,
	commentsState,

	dispatch,
	focusInputRef,

	setReplyToId,
	setParentCommentId,
	setReplyToUserName,
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
				isMounted &&
					dispatch({
						type: CommentActionTypes.ADD_COMMENTS,
						payload: { comments: res.data.comments },
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

		const interval = setInterval(() => {
			fetchComments();
		}, 20000);

		return () => {
			isMounted = false;
			clearInterval(interval);
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
								{post.user.userprofile.is_verified && <VerifiedIcon />}
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

			{
				/* {Error}
				 */
				!commentsState.isLoading && commentsState.errMsg && (
					<span className="text-center block text-red-400">
						{commentsState.errMsg}
					</span>
				)
			}

			{/* Comments */}
			{commentsState.isLoading ? (
				<SpinnerLoader />
			) : commentsState.comments && commentsState.comments.length > 0 ? (
				commentsState.comments.map((comment: CommentType) => (
					<Comment
						dispatch={dispatch}
						setReplyToUserName={setReplyToUserName}
						focusInputRef={focusInputRef}
						setParentCommentId={setParentCommentId}
						setReplyToId={setReplyToId}
						key={comment.id}
						replies={commentsState.replies}
						comment={comment}
					/>
				))
			) : (
				<span className="block w-full text-center py-10 text-sm text-gray-400">
					No Comments Yet
				</span>
			)}
			{
				<div className="flex justify-center">
					<Add onClick={() => {}} />
				</div>
			}
		</section>
	);
};

export default CommentsRenderer;
