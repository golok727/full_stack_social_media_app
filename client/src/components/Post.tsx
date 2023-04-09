import React from "react";
import { PostType } from "../utils/types";
import { Link } from "react-router-dom";
import Heart from "../icons/Heart";
import CommentIcon from "../icons/CommentIcon";
import ShareIcon from "../icons/ShareIcon";

interface Props {
	post: PostType;
}
const Post: React.FC<Props> = ({ post }) => {
	return (
		<div className="text-white border-[1px] border-slate-600 px-3 py-2 rounded">
			<header className="flex py-3 border-b-slate-600 border-b-2 mb-4 justify-between items-center">
				<div className="flex items-center gap-2">
					<div className="avatar cursor-pointer">
						<div
							className={`w-7 h-7 bg-orange-600 rounded-full text-white font-bold text-xs grid place-items-center select-none border-blue-200 border-[1px]`}
						>
							{post.user.username.charAt(0).toUpperCase()}
						</div>
					</div>
					{/* Username */}
					<h3
						className={`font-bold ${
							post.is_mine ? "text-orange-200" : "text-white"
						} hover:text-slate-400`}
					>
						@
						<Link to={`/${post.user.username}`}>
							<span className="">{post.user.username}</span>
						</Link>
					</h3>
				</div>

				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6 cursor-pointer hover:stroke-orange-400"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
						/>
					</svg>
				</div>
			</header>

			<section>
				<div
					className="rounded-md bg-gradient-to-r cursor-pointer from-slate-900 to to-slate-950 background-animate"
					style={{
						width: "400px",
						overflow: "hidden",
						height: "auto",
						minHeight: "400px",
					}}
				>
					<img
						style={{
							// aspectRatio: "",
							width: "100%",
							objectFit: "cover",
						}}
						src={post.image}
						alt={`Loading image: ${post.title}`}
						loading="lazy"
					/>
				</div>
			</section>

			<footer className="py-3">
				<header className="flex justify-between">
					<div className="flex gap-3 items-center">
						<Heart
							isActive={post.is_liked}
							onClick={() => console.log("Like")}
						/>
						<CommentIcon />
						<ShareIcon />
					</div>
				</header>
			</footer>
		</div>
	);
};

export default Post;
