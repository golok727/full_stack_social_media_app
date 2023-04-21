import React, { useEffect, useReducer, useState } from "react";
import { AvatarMakerSmall } from "../pages/PostPage";
import { Link } from "react-router-dom";
import { BioRenderer } from "../pages/Profile";
import Comment from "./Comment";
import SpinnerLoader from "./SpinnerLoader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
interface Props {
	post: PostType;
}

type ReducerState = {
	comments: CommentType[];
	isLoading: boolean;
	errMsg: string;
};

export enum CommentActionTypes {
	SET_COMMENTS = "SET_COMMENTS",
	COMMENTS_ERROR = "COMMENTS_ERROR",
	ADD_COMMENT = "ADD_COMMENT",
}

type SetCommentsAction = {
	type: CommentActionTypes.SET_COMMENTS;
	payload: {
		comments: CommentType[];
		isLoading: boolean;
	};
};

type AddCommentAction = {
	type: CommentActionTypes.ADD_COMMENT;
	payload: {
		comment: CommentType;
	};
};

type SetCommentsErrorAction = {
	type: CommentActionTypes.COMMENTS_ERROR;
	payload: {
		errMsg: string;
	};
};

export type CommentActions =
	| SetCommentsAction
	| SetCommentsErrorAction
	| AddCommentAction;

const CommentsReducer = (
	state: ReducerState,
	action: CommentActions
): ReducerState => {
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
const CommentsRenderer: React.FC<Props> = ({ post }) => {
	const [state, dispatch] = useReducer(CommentsReducer, {
		comments: [],
		isLoading: true,
		errMsg: "",
	} satisfies ReducerState);

	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchComments = async () => {
			try {
				const res = await axiosPrivate.get(`/api/posts/${post.id}/comments`, {
					signal: controller.signal,
				});
				console.log(res.data);

				dispatch({
					type: CommentActionTypes.SET_COMMENTS,
					payload: { comments: res.data, isLoading: false },
				});
			} catch (error) {
				// Todo Error Remove
				console.error(error);
				dispatch({
					type: CommentActionTypes.COMMENTS_ERROR,
					payload: { errMsg: "Error fetching comments" },
				});
			}
		};
		fetchComments();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

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
			{state.isLoading ? (
				<SpinnerLoader />
			) : state.comments && state.comments.length > 0 ? (
				state.comments.map((comment: CommentType) => (
					<Comment key={comment.id} comment={comment} />
				))
			) : (
				<span className="block w-full text-center py-10 text-sm text-gray-400">
					No Comments Yet
				</span>
			)}
		</section>
	);
};

export default CommentsRenderer;
