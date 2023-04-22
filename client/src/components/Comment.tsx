import { AvatarMakerSmall } from "../pages/PostPage";
import { Link } from "react-router-dom";
import { BioRenderer } from "../pages/Profile";
import { useMemo, useState } from "react";
import VerifiedIcon from "../icons/VerifiedIcon";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
type Props = {
	comment: CommentType;
};

const Comment = ({ comment }: Props) => {
	const [showReplies, setShowReplies] = useState(false);
	const [replies, setReplies] = useState<CommentType[]>([]);
	const axiosPrivate = useAxiosPrivate();

	// Handle Reply to comment -> will be moved to parent component
	const handleReplyToComment = (parentId: number, userId: number) => {
		console.log("Reply to " + parentId + " User: " + userId);
	};

	// Handle SHow Replies
	const handleShowReplies = async (commentId: number) => {
		setShowReplies((prev) => !prev);
		if (!showReplies) {
			try {
				const res = await axiosPrivate.get(
					`/api/posts/comments/${commentId}/replies`
				);
				console.log(res.data);
				setReplies(res.data);
			} catch (error) {}
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
					onClick={() => handleReplyToComment(comment.id, comment.user_id)}
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
						</span>
					</button>
				)}

				{showReplies && replies && replies.length > 0 && (
					<div className="">
						{replies.map((reply, idx) => (
							<Comment comment={reply} key={idx} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Comment;
