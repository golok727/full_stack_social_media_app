export type CommentReducerState = {
	comments: CommentType[];
	isLoading: boolean;
	errMsg: string;
	replies: {
		[id: number]: CommentType[];
	};
};

export enum CommentActionTypes {
	SET_COMMENTS = "SET_COMMENTS",
	COMMENTS_ERROR = "COMMENTS_ERROR",
	ADD_COMMENT = "ADD_COMMENT",
	INIT_REPLIES = "INIT_REPLIES",
	ADD_REPLY = "ADD_REPLY",
	LIKE_COMMENT = "LIKE_COMMENT",
	DISLIKE_COMMENT = "DISLIKE_COMMENT",
	PIN_COMMENT = "PIN_COMMENT",
	UNPIN_COMMENT = "UNPIN_COMMENT",
	DELETE_COMMENT = "DELETE_COMMENT",
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

type InitCommentRepliesAction = {
	type: CommentActionTypes.INIT_REPLIES;
	payload: {
		commentId: number;
		replies: CommentType[];
	};
};
type AddCommentReplyAction = {
	type: CommentActionTypes.ADD_REPLY;
	payload: {
		commentId: number;
		reply: CommentType;
	};
};

type LikeCommentAction = {
	type: CommentActionTypes.LIKE_COMMENT;
	payload: {
		isReply: boolean;
		commentId: number;
		parentId: number | null;
	};
};

type DisLikeCommentAction = {
	type: CommentActionTypes.DISLIKE_COMMENT;
	payload: {
		isReply: boolean;
		commentId: number;
		parentId: number | null;
	};
};
type PinCommentAction = {
	type: CommentActionTypes.PIN_COMMENT;
	payload: {
		commentId: number;
	};
};

type UnPinCommentAction = {
	type: CommentActionTypes.UNPIN_COMMENT;
	payload: {
		commentId: number;
	};
};

type DeleteCommentAction = {
	type: CommentActionTypes.DELETE_COMMENT;
	payload: {
		isReply: boolean;
		commentId: number;
		parentId: number | null;
	};
};

export type CommentActions =
	| SetCommentsAction
	| SetCommentsErrorAction
	| AddCommentAction
	| InitCommentRepliesAction
	| AddCommentReplyAction
	| LikeCommentAction
	| DisLikeCommentAction
	| PinCommentAction
	| UnPinCommentAction
	| DeleteCommentAction;

export const CommentsReducer = (
	state: CommentReducerState,
	action: CommentActions
): CommentReducerState => {
	switch (action.type) {
		case CommentActionTypes.SET_COMMENTS:
			return {
				...state,
				comments: action.payload.comments,
				isLoading: false,
				errMsg: "",
			};
		case CommentActionTypes.COMMENTS_ERROR:
			return {
				...state,

				isLoading: false,
				errMsg: action.payload.errMsg,
			};

		case CommentActionTypes.ADD_COMMENT:
			return {
				...state,
				comments: [...[action.payload.comment, ...state.comments]],
			};

		case CommentActionTypes.INIT_REPLIES:
			return {
				...state,
				replies: {
					...state.replies,
					[action.payload.commentId]: action.payload.replies,
				},
			};

		case CommentActionTypes.ADD_REPLY:
			const existingReplies = state.replies[action.payload.commentId] || [];
			const newReplies = [...existingReplies, ...[action.payload.reply]];

			// Update comment replies count
			const updatedComments = state.comments.map((comment) =>
				comment.id === action.payload.commentId
					? ({
							...comment,
							replies_count: comment.replies_count + 1,
					  } satisfies CommentType)
					: comment
			);
			return {
				...state,
				replies: { ...state.replies, [action.payload.commentId]: newReplies },
				comments: updatedComments,
			};

		case CommentActionTypes.LIKE_COMMENT:
			const isReply = action.payload.isReply;
			const commentId = action.payload.commentId;

			// If it is reply
			if (isReply) {
				if (action.payload.parentId === null) {
					throw new Error("If Comment is Reply then parentId cannot be null");
				}
				const allReplies = state.replies[action.payload.parentId];

				const updatedReplies = allReplies.map((reply) =>
					commentId === reply.id
						? {
								...reply,
								likes_count: reply.likes_count + 1,
								is_liked_by_me: true,
						  }
						: reply
				);
				return {
					...state,
					replies: {
						...state.replies,
						[action.payload.parentId]: updatedReplies,
					},
				};
			}

			return {
				...state,
				comments: state.comments.map((comment) =>
					comment.id === commentId
						? {
								...comment,
								is_liked_by_me: true,
								likes_count: comment.likes_count + 1,
						  }
						: comment
				),
			};

		case CommentActionTypes.DISLIKE_COMMENT:
			const isReplyDislike = action.payload.isReply;
			const commentIdDislike = action.payload.commentId;

			// If it is reply
			if (isReplyDislike) {
				if (action.payload.parentId === null) {
					throw new Error("If Comment is Reply then parentId cannot be null");
				}
				const allReplies = state.replies[action.payload.parentId];
				const updatedReplies = allReplies.map((reply) =>
					commentIdDislike === reply.id
						? {
								...reply,
								likes_count:
									reply.likes_count > 0
										? reply.likes_count - 1
										: reply.likes_count,
								is_liked_by_me: false,
						  }
						: reply
				);
				return {
					...state,
					replies: {
						...state.replies,
						[action.payload.parentId]: updatedReplies,
					},
				};
			}

			return {
				...state,
				comments: state.comments.map((comment) =>
					comment.id === commentIdDislike
						? {
								...comment,
								is_liked_by_me: false,
								likes_count:
									comment.likes_count > 0
										? comment.likes_count - 1
										: comment.likes_count,
						  }
						: comment
				),
			};

		case CommentActionTypes.PIN_COMMENT:
			const pinnedCommentId = action.payload.commentId;
			const updatedCommentsPin = state.comments.map((comment) =>
				comment.id === pinnedCommentId ? { ...comment, pinned: true } : comment
			);
			const sortedComments = updatedCommentsPin.sort((a, b) => {
				// Sort comments by the "pinned" property and then by the "created_at" property
				if (a.pinned === b.pinned) {
					return (
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
					);
				}
				return a.pinned ? -1 : 1;
			});
			return {
				...state,
				comments: sortedComments,
			};

		case CommentActionTypes.UNPIN_COMMENT:
			return {
				...state,
				comments: state.comments.map((comment) =>
					comment.id === action.payload.commentId
						? { ...comment, pinned: false }
						: comment
				),
			};

		case CommentActionTypes.DELETE_COMMENT:
			const isReplyDelete = action.payload.isReply;
			const commentIdDelete = action.payload.commentId;

			// If it is reply
			if (isReplyDelete) {
				if (action.payload.parentId === null) {
					throw new Error("If Comment is Reply then parentId cannot be null");
				}
				const allReplies = state.replies[action.payload.parentId];

				const updatedReplies = allReplies.filter(
					(reply) => commentIdDelete !== reply.id
				);

				return {
					...state,
					replies: {
						...state.replies,
						[action.payload.parentId]: updatedReplies,
					},
				};
			}

			return {
				...state,
				comments: state.comments.filter(
					(comment) => comment.id !== commentIdDelete
				),
			};

		default:
			return state;
	}
};
