import React, { useEffect, useState } from "react";
import { PostType } from "../utils/types";
import { Link } from "react-router-dom";
import Heart from "../icons/Heart";
import CommentIcon from "../icons/CommentIcon";
import ShareIcon from "../icons/ShareIcon";
import SaveIcon from "../icons/SaveIcon";
import SmileIcon from "../icons/Smile";

interface Props {
	post: PostType;
}

const numberFormatter = (n: number): string => {
	const formatter = new Intl.NumberFormat("en", { notation: "compact" });
	return formatter.format(n);
};

const formatDate = (str: Date | string): string => {
	const formatter = new Intl.DateTimeFormat("en", {
		month: "long",
		day: "2-digit",
	});

	return formatter.format(new Date(str)).toUpperCase();
};

const truncateString = (s: string): string => {
	return s.substring(0, 75) + " ...";
};

const splitNewLines = (str: string): string[] => str.split(/\r?\n/);

const Post: React.FC<Props> = ({ post }) => {
	const splitDescription = splitNewLines(post.description);
	const [truncateDesc, setTruncateDesc] = useState(
		splitDescription.length > 1 || post.description.length > 70
	);

	return (
		<div className="text-white border-[1px] border-slate-600 px-3 py-2 rounded ">
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
						maxWidth: "400px",
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

			<footer className="py-1">
				<header className="flex justify-between mb-3">
					<div className="flex gap-3 items-center">
						<Heart
							isActive={post.is_liked}
							onClick={() => console.log("Like")}
						/>
						<CommentIcon />
						<ShareIcon />
					</div>

					<div>
						<SaveIcon isActive={false} />
					</div>
				</header>

				{/* Section After Like Button And Stuff  */}
				<section>
					{/* Likes Count */}
					<div>
						<span className="cursor-pointer text-sm font-bold tracking-tighter">
							{numberFormatter(post.likes_count)}{" "}
							{post.likes_count === 1 ? "like" : "likes"}
						</span>
					</div>

					{/* Title, Description */}

					<div className="text-sm py-2 break-words max-w-[50ch]">
						<p className="inline-block">
							<Link to={"/" + post.user.username}>
								<span className="font-bold mr-2">{post.user.username}</span>
							</Link>
							{post.title}
						</p>

						<div className="py-2 text-[.8rem]">
							{truncateDesc
								? "..."
								: splitDescription.map((line, idx) => (
										<span key={idx} className="block">
											{line}
										</span>
								  ))}
						</div>
					</div>
					{truncateDesc && (
						<button
							className="text-slate-400 hover:text-slate-300 text-xs"
							onClick={() => setTruncateDesc(false)}
						>
							more
						</button>
					)}
				</section>

				{/* date time */}
				<section className="text-gray-400 text-sm py-2">
					<a href="#">
						<span>View all Comments</span>
					</a>
					<br />
					<span className="text-[.6rem] font-bold">
						{formatDate(post.created)}
					</span>
				</section>

				{/* Add Comment */}
				<section className="border-t-[1px] border-gray-700 pt-2 px-2">
					<CommentForm />
				</section>
			</footer>
		</div>
	);
};

function CommentForm() {
	const [textAreaHeightValue, setTextAreaHeightValue] = useState("10");
	const [limit, setLimit] = useState(false);

	return (
		<form className="flex gap-2 items-center ">
			<div>
				<SmileIcon />
			</div>
			<textarea
				onInput={(e) => {
					if (!e.currentTarget.value) {
						setTextAreaHeightValue("auto");
						return;
					}
					if (e.currentTarget.scrollHeight >= 100) {
						setLimit(true);
						setTextAreaHeightValue(`100px`);
						return;
					}
					setTextAreaHeightValue("auto");
					setTextAreaHeightValue(`${e.currentTarget.scrollHeight}px`);
					console.log(e.currentTarget.scrollHeight);
				}}
				style={{
					height: textAreaHeightValue,
				}}
				className={`flex-1 bg-transparent placeholder:text-sm placeholder:text-gray-400 text-sm resize-none ${
					limit ? "overflow-y-auto" : "overflow-hidden"
				} outline-none text-xs`}
				placeholder="Add a comment"
			/>
			<input
				type="submit"
				className="font-bold text-blue-200 text-sm cursor-pointer"
				value={"Post"}
			/>
		</form>
	);
}

export default Post;
