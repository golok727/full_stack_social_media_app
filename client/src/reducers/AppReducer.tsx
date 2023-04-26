export interface AppReducerState {
	homePosts: PostType[];
	errors: AppErrors;
}

export enum AppReducerActions {
	INIT_POSTS = "INIT_POSTS",
	SET_ERRORS = "SET_ERRORS",
	RESET_ERRORS = "RESET_ERRORS",
}

interface InitPostAction {
	type: AppReducerActions.INIT_POSTS;
	payload: {
		posts: PostType[];
	};
}

interface SetErrorsAction {
	type: AppReducerActions.SET_ERRORS;
	payload: {};
}

interface ResetErrorsAction {
	type: AppReducerActions.RESET_ERRORS;
	payload: {};
}

export type AppActions = InitPostAction | SetErrorsAction | ResetErrorsAction;

const AppReducer = (
	state: AppReducerState,
	action: AppActions
): AppReducerState => {
	switch (action.type) {
		case AppReducerActions.INIT_POSTS:
			return { ...state, homePosts: action.payload.posts };

		default:
			return state;
	}
};

export default AppReducer;
