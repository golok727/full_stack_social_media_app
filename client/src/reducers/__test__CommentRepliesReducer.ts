export interface CommentRepliesReducerState {
	comments: {
		[key: number]: CommentType[];
	};
}
type ActionType =
	| { type: "ADD_REPLY"; payload: { commentId: number; reply: CommentType } }
	| {
			type: "INIT_REPLIES";
			payload: { commentId: number; replies: CommentType[] };
	  };

export const commentRepliesReducer = (
	state: CommentRepliesReducerState,
	action: ActionType
) => {
	switch (action.type) {
		case "ADD_REPLY": {
			const { commentId, reply } = action.payload;

			// Create a new array with the new reply added
			const newReplies = [...state.comments[commentId], reply];

			// Return a new state object with the new array of replies
			return {
				...state,
				comments: {
					...state.comments,
					[commentId]: newReplies,
				},
			};
		}
		case "INIT_REPLIES": {
			const { commentId, replies } = action.payload;

			// Return a new state object with the initialized replies for the comment
			return {
				...state,
				comments: {
					...state.comments,
					[commentId]: replies,
				},
			};
		}
		default:
			return state;
	}
};
