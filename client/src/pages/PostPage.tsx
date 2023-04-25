import { Link, Navigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { useEffect, useReducer, useRef, useState } from "react";
import SpinnerLoader from "../components/SpinnerLoader";
import CommentsRenderer from "../components/CommentsRenderer";
import Heart from "../icons/Heart";
import CommentIcon from "../icons/CommentIcon";
import ShareIcon from "../icons/ShareIcon";
import SaveIcon from "../icons/SaveIcon";
import { formatDate, numberFormatter } from "../utils/utils";
import CommentForm from "../components/CommentFrom";
import VerifiedIcon from "../icons/VerifiedIcon";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
	CommentReducerState,
	CommentsReducer,
} from "../reducers/CommentsReducer";
import SettingHorizontal from "../icons/SettingHorizontal";
import { useModal } from "../context/ModalProvider";

const PostPage = () => {
	const [commentsState, dispatch] = useReducer(CommentsReducer, {
		comments: [],
		isLoading: true,
		errMsg: "",
		replies: {},
	} satisfies CommentReducerState);

	const { postId } = useParams();
	const axiosPrivate = useAxiosPrivate();

	// Custom Hooks
	const { showModal } = useModal();

	const [post, setPost] = useState<PostType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const commentFormInputRef = useRef<HTMLTextAreaElement>(null);

	const [isLiked, setIsLiked] = useState(false);

	const handleLike = async () => {
		if (post) {
			setIsLiked((prev: boolean) => !prev);
			const updatedLikesCount = isLiked
				? post.likes_count - 1
				: post.likes_count + 1;
			setPost(
				(prev) => ({ ...prev, likes_count: updatedLikesCount } as PostType)
			);

			try {
				await axiosPrivate.post(`/api/posts/like/${post.id}`);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const focusInputRef = () => {
		if (commentFormInputRef.current) {
			commentFormInputRef.current.focus();
		}
	};

	// For Reply TO
	const [replyToId, setReplyTo] = useState<number | null>(null);
	const [parentCommentId, setParentCommentId] = useState<number | null>(null);
	const [replyToUserName, setReplyToUserName] = useState<string | null>(null);

	const resetReplyingToState = () => {
		setReplyTo(null);
		setParentCommentId(null);
		setReplyToUserName(null);
	};

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchPostById = async () => {
			try {
				const res = await axiosPrivate.get(`/api/posts/${postId}`, {
					signal: controller.signal,
				});

				setPost(() => res.data);
				setIsLiked(() => (res.data as PostType).is_liked);

				useDocumentTitle(
					`${(res.data as PostType).user.full_name}  On Photon: "${
						res.data.title
					}"`
				);
			} catch (error: any) {
				console.log(error);
				setPost(() => null);
			} finally {
				setIsLoading(false);
			}
		};
		postId && fetchPostById();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [postId]);
	return (
		<div className="pt-20 flex justify-center items-center min-h-screen text-white container mx-auto max-w-2xl">
			{!isLoading ? (
				post ? (
					<div className="flex md:min-h-[40em] min-h-[30em] md:max-h-[40em] flex-col md:flex-row border-[1px] rounded-md border-gray-700 overflow-hidden">
						<div className="aspect md:h-[40em] h-[27em] md:max-w-2xl ">
							<img
								src={post.image}
								className="h-full object-cover"
								alt={post.title}
							/>
						</div>
						{/* Right */}
						<div className="flex flex-col flex-1 md:w-[35em] w-full">
							{/* Header */}
							<header className="flex justify-between items-center  px-3 py-2 border-b-gray-800 border-b-2">
								<div className="flex items-center gap-2">
									<AvatarMakerSmall
										avatar={post.user.userprofile.profile_image}
										username={post.user.username}
									/>
									<Link className="font-bold " to={"/" + post.user.username}>
										{post.user.username}
										{post.user.userprofile.is_verified && <VerifiedIcon />}
									</Link>
								</div>
								{/* Three Dot */}
								<div>
									<SettingHorizontal
										onClick={() =>
											showModal("POST_OPTIONS", {
												postId: post.id,
												userId: post.user.id,
											})
										}
									/>
								</div>
							</header>

							{/* Comments Renderer */}

							<CommentsRenderer
								commentsState={commentsState}
								post={post}
								// Fns

								setReplyToUserName={setReplyToUserName}
								focusInputRef={focusInputRef}
								setReplyToId={setReplyTo}
								setParentCommentId={setParentCommentId}
								dispatch={dispatch}
							/>

							{/* Footer */}
							<footer className="block py-2 px-3">
								{/* Post */}
								<div className="border-b-[1px] border-b-gray-700 my-3">
									<div className="py-1 flex justify-between ">
										<div className="flex gap-2">
											<Heart isActive={isLiked} onClick={() => handleLike()} />

											<CommentIcon
												onClick={() => {
													if (commentFormInputRef.current) {
														commentFormInputRef.current.focus();
													}
												}}
											/>

											<ShareIcon />
										</div>
										<div>
											<SaveIcon />
										</div>
									</div>
									<div>
										<span className="font-bold text-sm">
											{numberFormatter(post.likes_count)}{" "}
											{post.likes_count === 1 ? "like" : "likes"}
										</span>
									</div>
									<span className="text-xs text-gray-500">
										{formatDate(post.created)}
									</span>
								</div>

								{/* Comment Form */}
								<CommentForm
									resetReplyingToState={resetReplyingToState}
									replyToUserName={replyToUserName}
									parent={parentCommentId}
									reply_to={replyToId}
									dispatch={dispatch}
									ref={commentFormInputRef}
									postId={post.id}
								/>
							</footer>
						</div>
					</div>
				) : (
					<Navigate to={"/404"} />
				)
			) : (
				<SpinnerLoader />
			)}
		</div>
	);
};

export default PostPage;

export function AvatarMakerSmall({
	avatar,
	username,
	border = true,
}: {
	avatar: string | null;
	username: string;
	border?: boolean;
}) {
	return avatar ? (
		<div
			className={`w-10 h-10 rounded-full overflow-hidden ${
				border && "border-[2px] border-red-600"
			} `}
		>
			<img className="object-cover h-full w-full" src={avatar} alt="" />
		</div>
	) : (
		<div
			className={`w-10 h-10  bg-orange-600 rounded-full text-white font-bold text-sm grid place-items-center select-none border-blue-200 border-[1px]`}
		>
			<span className="text-sm">{username?.charAt(0).toUpperCase()}</span>
		</div>
	);
}
