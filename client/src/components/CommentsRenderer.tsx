import React from "react";
import { AvatarMakerSmall } from "../pages/PostPage";
import { Link } from "react-router-dom";
import { BioRenderer } from "../pages/Profile";
import Comment from "./Comment";
import { useReducedMotion } from "framer-motion";
interface Props {
	post: PostType;
}
const CommentsRenderer: React.FC<Props> = ({ post }) => {
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
			{Array.from({ length: 100 }, () => "Comment").map((comment, idx) => (
				<Comment
					content={"commnet afimnlokma alsdfjknm asdfkljmn " + idx}
					avatar={post.user.userprofile.profile_image}
					username="nara"
				/>
			))}
		</section>
	);
};

export default CommentsRenderer;
