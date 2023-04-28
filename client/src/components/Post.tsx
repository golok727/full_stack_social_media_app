import React, { useState } from "react";

import { Link } from "react-router-dom";
import Heart from "../icons/Heart";
import CommentIcon from "../icons/CommentIcon";
import ShareIcon from "../icons/ShareIcon";
import SaveIcon from "../icons/SaveIcon";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import FollowButton from "./FollowButton";
import { formatDate, numberFormatter } from "../utils/utils";
import CommentForm from "./CommentFrom";
import VerifiedIcon from "../icons/VerifiedIcon";
import SettingHorizontal from "../icons/SettingHorizontal";
import { useModal } from "../context/ModalProvider";
import { PhotonParserRenderer } from "./PhotonTextParser";
interface Props {
	post: PostType;
}

const Post: React.FC<Props> = ({ post }) => {
	const [imageLoadError, setImageLoadError] = useState(false);

	const [truncateDesc, setTruncateDesc] = useState(() => {
		const { description } = post;
		return description.length > 70 || description.includes("\n");
	});

	const axiosPrivate = useAxiosPrivate();

	const [likesCount, setLikesCount] = useState(post.likes_count);
	const [isLiked, setIsLiked] = useState(post.is_liked);

	// Modal
	const { showModal } = useModal();
	// Handle Like
	const handleLike = async () => {
		setIsLiked((prev) => !prev);
		const updatedLikesCount = isLiked ? likesCount - 1 : likesCount + 1;
		setLikesCount(updatedLikesCount);

		try {
			await axiosPrivate.post(`/api/posts/like/${post.id}`);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="text-white border-[1px] border-neutral-700 px-3 py-2 rounded ">
			<header className="flex py-3 border-b-neutral-600 border-b-2 mb-4 justify-between items-center">
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
						className={`font-bold flex items-center ${
							post.is_mine ? "text-orange-200" : "text-white"
						} hover:text-slate-400`}
					>
						@
						<Link to={`/${post.user.username}`}>
							<span className="">{post.user.username}</span>
						</Link>
						{post.user.userprofile.is_verified && <VerifiedIcon />}
					</h3>

					{!post.is_mine && !post.is_following && (
						<FollowButton
							is_following={post.is_following}
							userId={post.user.id}
						/>
					)}
				</div>

				<div>
					<SettingHorizontal
						onClick={() =>
							showModal("POST_OPTIONS", {
								post,
							})
						}
					/>
				</div>
			</header>

			<section>
				<div
					className="md:w-[500px] w-[400px]  rounded-md bg-gradient-to-r cursor-pointer from-slate-900 to to-slate-950 background-animate"
					style={{
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
						<Heart
							aria-label="Like"
							isActive={isLiked}
							onClick={() => handleLike()}
						/>
						<Link to={`/p/${post.id}`}>
							<CommentIcon />
						</Link>
						<ShareIcon />
					</div>

					<div>
						<SaveIcon postId={post.id} isActive={post.is_saved} />
					</div>
				</header>

				{/* Section After Like Button And Stuff  */}
				<section>
					{/* Likes Count */}
					<div>
						<span className="cursor-pointer text-sm font-bold tracking-tighter">
							{numberFormatter(likesCount)}{" "}
							{post.likes_count === 1 ? "like" : "likes"}
						</span>
					</div>

					{/* Title, Description */}

					<div className="text-sm py-2 break-words max-w-[50ch]">
						<p className="inline-block">
							<Link to={"/" + post.user.username}>
								<span className="font-bold mr-2">{post.user.username}</span>
							</Link>
							{/* Make A separate comp to render title that also works with description */}
						</p>
						<PhotonParserRenderer text={post.title} nextLine={false} />

						<div className="py-2 text-[.8rem]">
							{truncateDesc ? (
								"..."
							) : (
								<PhotonParserRenderer text={post.description} />
							)}
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
					<Link to={`/p/${post.id}`}>
						<span>View all Comments</span>
					</Link>
					<br />
					<span className="text-[.6rem] font-bold">
						{formatDate(post.created)}
					</span>
				</section>

				{/* Add Comment */}
				<section className="border-t-[1px] border-gray-700 pt-2 px-2">
					<CommentForm
						resetReplyingToState={() => {}}
						parent={null}
						replyToUserName={null}
						reply_to={null}
						postId={post.id}
					/>
				</section>
			</footer>
		</div>
	);
};

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
