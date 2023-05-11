export interface AppReducerState {
	homePosts: PostType[];
	errors: AppErrors;
}

export enum AppReducerActions {
	INIT_POSTS = "INIT_POSTS",
	RESET_HOME_POSTS = "RESET_HOME_POSTS",
	SET_ERRORS = "SET_ERRORS",
	RESET_ERRORS = "RESET_ERRORS",
}

interface InitPostAction {
	type: AppReducerActions.INIT_POSTS;
	payload: {
		posts: PostType[];
	};
}
interface ResetHomePosts {
	type: AppReducerActions.RESET_HOME_POSTS;
}

interface SetErrorsAction {
	type: AppReducerActions.SET_ERRORS;
	payload: {};
}

interface ResetErrorsAction {
	type: AppReducerActions.RESET_ERRORS;
	payload: {};
}

export type AppActions =
	| InitPostAction
	| SetErrorsAction
	| ResetErrorsAction
	| ResetHomePosts;

const AppReducer = (
	state: AppReducerState,
	action: AppActions
): AppReducerState => {
	switch (action.type) {
		case AppReducerActions.INIT_POSTS: {
			return { ...state, homePosts: action.payload.posts };
		}

		case AppReducerActions.RESET_HOME_POSTS: {
			return { ...state, homePosts: [] };
		}

		default:
			return state;
	}
};

export default AppReducer;
