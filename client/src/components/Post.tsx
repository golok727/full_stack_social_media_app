import React, { useMemo, useState } from "react";

import { Link } from "react-router-dom";
import Heart from "../icons/Heart";
import CommentIcon from "../icons/CommentIcon";
import ShareIcon from "../icons/ShareIcon";
import SaveIcon from "../icons/SaveIcon";
import SmileIcon from "../icons/Smile";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import FollowButton from "./FollowButton";
import { formatDate, numberFormatter } from "../utils/utils";
import { BioRenderer } from "../pages/Profile";
interface Props {
	post: PostType;
}

const splitNewLines = (str: string): string[] => {
	console.log("RUN MEMO");
	return str.split(/\r?\n/);
};

const Post: React.FC<Props> = ({ post }) => {
	const [imageLoadError, setImageLoadError] = useState(false);
	const splitDescription = useMemo(
		() => splitNewLines(post.description),
		[post.description]
	);
	const [truncateDesc, setTruncateDesc] = useState(
		splitDescription.length > 1 || post.description.length > 70
	);
	const axiosPrivate = useAxiosPrivate();
	const [isLiked, setIsLiked] = useState(post.is_liked);
	const handleLike = async () => {
		try {
			const res = await axiosPrivate.post(`/api/posts/like/${post.id}`);
		} catch (error) {
			console.log(error);
		}

		setIsLiked((prev: boolean) => !prev);
		if (isLiked && post.likes_count > 0) post.likes_count--;
		else post.likes_count++;
	};

	return (
		<div className="text-white border-[1px] border-slate-600 px-3 py-2 rounded ">
			<header className="flex py-3 border-b-slate-600 border-b-2 mb-4 justify-between items-center">
				<div className="flex items-center gap-2">
					<div className="avatar cursor-pointer">
						{post.user.userprofile.profile_image ? (
							<div className="w-8 h-8 rounded-full overflow-hidden border-[2px] border-red-600">
								<img
									className="object-contain"
									src={post.user.userprofile.profile_image}
									alt=""
								/>
							</div>
						) : (
							<LetterAvatar username={post.user.username} />
						)}
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
					{!post.is_mine && !post.is_following && (
						<FollowButton
							is_following={post.is_following}
							userId={post.user.id}
						/>
					)}
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
						...(imageLoadError ? { minHeight: "400px" } : {}),
					}}
				>
					<img
						style={{
							// aspectRatio: "",
							width: "100%",
							objectFit: "cover",
						}}
						onLoad={() => setImageLoadError(false)}
						onError={() => setImageLoadError(true)}
						src={post.image}
						alt={`Loading image: ${post.title}`}
						loading="lazy"
					/>
				</div>
			</section>

			<footer className="py-3">
				<header className="flex justify-between mb-3">
					<div className="flex gap-3 items-center">
						<Heart isActive={isLiked} onClick={() => handleLike()} />
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
							{truncateDesc ? "..." : <BioRenderer bio={splitDescription} />}
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

function LetterAvatar({ username }: { username: string }) {
	return (
		<div
			className={`w-8 h-8 bg-orange-600 rounded-full text-white font-bold text-xs grid place-items-center select-none border-blue-200 border-[1px]`}
		>
			{username.charAt(0).toUpperCase()}
		</div>
	);
}
