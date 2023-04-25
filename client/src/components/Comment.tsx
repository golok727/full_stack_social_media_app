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
import Pin from "../icons/Pin";
import Heart from "../icons/Heart";
import { formatDate, numberFormatter } from "../utils/utils";
import { useModal } from "../context/ModalProvider";
import SettingHorizontal from "../icons/SettingHorizontal";
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
	// Modal
	const { showModal } = useModal();

	// State
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

		// console.log(
		// 	"Reply to " + parentId + " User: " + userId,
		// 	" @" + replyToUsername
		// );

		setShowReplies(true);
	};

	// Handle Show Replies
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

	// Handle Like Comment
	const handleLike = async () => {
		console.log("Like" + " " + comment.content);

		if (comment.is_liked_by_me) {
			dispatch({
				type: CommentActionTypes.DISLIKE_COMMENT,
				payload: {
					commentId: comment.id,
					parentId: comment.top_level_parent_id,
					isReply: comment.parent !== null,
				},
			});

			await axiosPrivate.post(`/api/comment/${comment.id}/dislike/`);
		} else {
			dispatch({
				type: CommentActionTypes.LIKE_COMMENT,
				payload: {
					commentId: comment.id,
					parentId: comment.top_level_parent_id,
					isReply: comment.parent !== null,
				},
			});
			// Post to server

			await axiosPrivate.post(`/api/comment/${comment.id}/like/`);
		}
	};

	const commentContentSplit = useMemo(() => {
		const newCommentContent = comment.reply_to
			? "@" + comment.reply_to_username + " " + comment.content
			: comment.content;
		return newCommentContent.split(/\r?\n/);
	}, [comment]);

	return (
		<div>
			<div className="flex gap-2 my-5 group">
				{/* Left */}
				<div>
					<AvatarMakerSmall
						avatar={comment.user_profile.profile_image}
						username={comment.user}
						border={false}
					/>
				</div>
				{/* Mid */}
				<div className="flex-1">
					<Link
						to={"/" + comment.user}
						className="font-bold hover:text-gray-400"
					>
						<span className={`${comment.is_mine && "text-orange-400"}`}>
							{comment.user}
						</span>
						{comment.user_profile.is_verified && <VerifiedIcon />}
						{comment.pinned && (
							<span className="text-gray-400 text-xs font-thin ml-2">
								<Pin className="w-3 h-3 inline-block" /> pinned
							</span>
						)}
					</Link>
					{/* Parse the comments */}
					<span className="block text-sm">
						{" "}
						<BioRenderer bio={commentContentSplit} />{" "}
					</span>

					{/* Status */}
					<div className="font-bold flex gap-2 py-1 items-center relative">
						<span className="text-xs text-gray-500">
							{formatDate(comment.created_at)}
						</span>
						<span className="text-xs text-gray-500">
							{numberFormatter(comment.likes_count)}
							{comment.likes_count === 1 ? " like" : " likes"}
						</span>
						<button
							onClick={() =>
								handleReplyToComment(comment.id, comment.user_id, comment.user)
							}
							className="text-xs text-gray-500 hover:text-gray-300"
						>
							Reply
						</button>{" "}
						<SettingHorizontal
							className="w-6 h-6 stroke-gray-300 cursor-pointer hidden group-hover:block absolute left-1/3  transition-all duration-150"
							onClick={() =>
								showModal("COMMENT_OPTIONS", {
									commentId: comment.id,
									userId: comment.user_id,
								})
							}
						/>
					</div>
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
				</div>
				<div className="self-center flex flex-col items-center">
					<Heart
						isActive={comment.is_liked_by_me}
						onClick={() => handleLike()}
						className="w-3 h-3 cursor-pointer"
					/>
				</div>
			</div>
			{showReplies &&
				repliesReducer[comment.id] &&
				repliesReducer[comment.id].length > 0 && (
					<div className="pl-10">
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
	);
};

export default Comment;
