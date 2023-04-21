type CommentReducerState = {
	comments: CommentType[];
	isLoading: boolean;
	errMsg: string;
};

enum CommentActionTypes {
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

type CommentActions =
	| SetCommentsAction
	| SetCommentsErrorAction
	| AddCommentAction;
