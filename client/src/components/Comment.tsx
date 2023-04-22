import { AvatarMakerSmall } from "../pages/PostPage";
import { Link } from "react-router-dom";
import { BioRenderer } from "../pages/Profile";
import React, { useMemo, useState } from "react";
import VerifiedIcon from "../icons/VerifiedIcon";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
	CommentActionTypes,
	CommentActions,
} from "../reducers/CommentsReducer";
type Props = {
	comment: CommentType;
	dispatch: React.Dispatch<CommentActions>;
	setReplyToId: React.Dispatch<React.SetStateAction<number | null>>;
	setParentCommentId: React.Dispatch<React.SetStateAction<number | null>>;
	focusInputRef: () => void;
	setReplyToUserName: React.Dispatch<React.SetStateAction<string | null>>;
	replies: {
		[id: number]: CommentType[];
	};
};

const Comment = ({
	comment,
	dispatch,
	setParentCommentId,
	setReplyToId,
	focusInputRef,
	setReplyToUserName,
	replies: repliesReducer,
}: Props) => {
	const [showReplies, setShowReplies] = useState(false);
	// const [replies, setReplies] = useState<CommentType[]>([]);
	const [loadingReplies, setLoadingReplies] = useState(false);

	const axiosPrivate = useAxiosPrivate();

	// Handle Reply to comment -> will be moved to parent component
	const handleReplyToComment = (
		parentId: number,
		userId: number,
		replyToUsername: string
	) => {
		setReplyToId(userId);
		setParentCommentId(parentId);
		setReplyToUserName(replyToUsername);
		focusInputRef();
		console.log(
			"Reply to " + parentId + " User: " + userId,
			" @" + replyToUsername
		);
	};

	// Handle SHow Replies
	const handleShowReplies = async (commentId: number) => {
		setShowReplies((prev) => !prev);
		if (!showReplies) {
			try {
				setLoadingReplies(true);
				const res = await axiosPrivate.get(
					`/api/posts/comments/${commentId}/replies`
				);

				// setReplies(res.data);
				dispatch({
					type: CommentActionTypes.INIT_REPLIES,
					payload: {
						commentId: commentId,
						replies: res.data,
					},
				});
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingReplies(false);
			}
		}
	};

	const commentContentSplit = useMemo(() => {
		const newCommentContent = comment.reply_to
			? "@" + comment.reply_to_username + " " + comment.content
			: comment.content;
		return newCommentContent.split(/\r?\n/);
	}, [comment]);

	return (
		<div className="flex gap-2 my-5">
			<div>
				<AvatarMakerSmall
					avatar={comment.user_profile.profile_image}
					username={comment.user}
					border={false}
				/>
			</div>
			<div>
				<Link to={"/" + comment.user} className="font-bold hover:text-gray-400">
					{comment.user}

					{comment.user_profile.is_verified && <VerifiedIcon />}
				</Link>
				{/* Parse the comments */}
				<span className="block text-sm">
					{" "}
					<BioRenderer bio={commentContentSplit} />{" "}
				</span>

				<button
					onClick={() =>
						handleReplyToComment(comment.id, comment.user_id, comment.user)
					}
					className="text-xs text-gray-500 hover:text-gray-300"
				>
					Reply
				</button>

				{comment.parent === null && comment.replies_count > 0 && (
					<button
						onClick={() => handleShowReplies(comment.id)}
						className="text-xs text-gray-400 hover:text-gray-300 flex items-center"
					>
						<span className="w-[30px] h-[1px] bg-slate-400 inline-block "></span>

						<span className="mx-2">
							{showReplies ? "Hide replies" : "View replies"}
							{!showReplies && " (" + comment.replies_count + ")"}
							{showReplies && loadingReplies && " Loading..."}
						</span>
					</button>
				)}

				{showReplies &&
					repliesReducer[comment.id] &&
					repliesReducer[comment.id].length > 0 && (
						<div className="">
							{repliesReducer[comment.id].map((reply, idx) => (
								<Comment
									replies={repliesReducer}
									dispatch={dispatch}
									setReplyToUserName={setReplyToUserName}
									focusInputRef={focusInputRef}
									setParentCommentId={setParentCommentId}
									setReplyToId={setReplyToId}
									comment={reply}
									key={idx}
								/>
							))}
						</div>
					)}
			</div>
		</div>
	);
};

export default Comment;
