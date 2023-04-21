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
import { formatDate } from "../utils/utils";
import CommentForm from "../components/CommentFrom";

const CommentsReducer = (
	state: CommentReducerState,
	action: CommentActions
): CommentReducerState => {
	switch (action.type) {
		case CommentActionTypes.SET_COMMENTS:
			return {
				...state,
				comments: action.payload.comments,
				isLoading: false,
				errMsg: "Can't Get Comments",
			};
		case CommentActionTypes.COMMENTS_ERROR:
			return {
				...state,
				comments: [],
				isLoading: false,
				errMsg: action.payload.errMsg,
			};

		case CommentActionTypes.ADD_COMMENT:
			return {
				...state,
				comments: [...[action.payload.comment, ...state.comments]],
			};
		default:
			return state;
	}
};

const PostPage = () => {
	const [commentsState, dispatch] = useReducer(CommentsReducer, {
		comments: [],
		isLoading: true,
		errMsg: "",
	} satisfies CommentReducerState);

	const { postId } = useParams();
	const axiosPrivate = useAxiosPrivate();
	const { auth } = useAuth();

	const [post, setPost] = useState<PostType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const commentFormInputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchPostById = async () => {
			try {
				const res = await axiosPrivate.get(`/api/posts/${postId}`, {
					signal: controller.signal,
				});

				setPost(() => res.data);
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
									</Link>
								</div>
								{/* Three Dot */}
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

							{/* Comments Renderer */}

							<CommentsRenderer
								commentsState={commentsState}
								dispatch={dispatch}
								post={post}
							/>

							{/* Footer */}
							<footer className="block py-2 px-3">
								{/* Post */}
								<div className="border-b-[1px] border-b-gray-700 my-3">
									<div className="py-1 flex justify-between ">
										<div className="flex gap-2">
											<Heart isActive={post.is_liked} />

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
									<span className="text-xs text-gray-500">
										{formatDate(post.created)}
									</span>
								</div>

								{/* Comment Form */}
								<CommentForm
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
