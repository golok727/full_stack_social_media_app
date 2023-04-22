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

type InitCommentReplies = {
	type: CommentActionTypes.INIT_REPLIES;
	payload: {
		commentId: number;
		replies: CommentType[];
	};
};
type AddCommentReply = {
	type: CommentActionTypes.ADD_REPLY;
	payload: {
		commentId: number;
		reply: CommentType;
	};
};
export type CommentActions =
	| SetCommentsAction
	| SetCommentsErrorAction
	| AddCommentAction
	| InitCommentReplies
	| AddCommentReply;

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

		case CommentActionTypes.INIT_REPLIES:
			return {
				...state,
				replies: {
					...state.replies,
					[action.payload.commentId]: action.payload.replies,
				},
			};

		case CommentActionTypes.ADD_REPLY:
			const newReplies = [
				...state.replies[action.payload.commentId],
				...[action.payload.reply],
			];
			return {
				...state,
				replies: { ...state.replies, [action.payload.commentId]: newReplies },
			};

		default:
			return state;
	}
};
