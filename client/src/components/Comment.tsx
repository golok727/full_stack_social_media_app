import { AvatarMakerSmall } from "../pages/PostPage";
import { Link } from "react-router-dom";
import { BioRenderer } from "../pages/Profile";
import { useMemo } from "react";
import VerifiedIcon from "../icons/VerifiedIcon";
type Props = {
	comment: CommentType;
};

const Comment = ({ comment }: Props) => {
	const handleReplyToComment = (parentId: number) => {
		console.log("Reply to " + parentId);
	};
	const commentContentSplit = useMemo(() => {
		console.log("RUN");
		return comment.content.split(/\r?\n/);
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
					onClick={() => handleReplyToComment(comment.id)}
					className="text-xs text-gray-500 hover:text-gray-300"
				>
					Reply
				</button>
			</div>
		</div>
	);
};

export default Comment;
