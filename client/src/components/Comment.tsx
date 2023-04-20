import React from "react";
import { AvatarMakerSmall } from "../pages/PostPage";
import { Link } from "react-router-dom";

type Props = {
	content: string;
	avatar: string;
	likes?: number;
	username: string;
};

const Comment = ({ content, avatar, username }: Props) => {
	const handleReplyToComment = (commentId: number) => {};

	return (
		<div className="flex items-center gap-2 my-5">
			<div>
				<AvatarMakerSmall avatar={avatar} username={username} border={false} />
			</div>
			<div>
				<Link to={"/" + username} className="font-bold hover:text-gray-400">
					{username}
				</Link>
				<span className="block text-sm">{content + " "}</span>

				<button
					onClick={() => handleReplyToComment(1)}
					className="text-xs text-gray-500 hover:text-gray-300"
				>
					Reply
				</button>
			</div>
		</div>
	);
};

export default Comment;
