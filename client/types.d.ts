interface PostType {
	created: Date;
	description: string;
	id: number;
	image: string;
	is_liked: boolean;
	is_mine: boolean;
	likes: number[];
	likes_count: number;
	title: string;
	updated: Date;
	user: User;
	is_following: boolean;
}
interface UserprofileUser {
	followers_count: number;
	id: number;
	profile_image: string;
	is_verified: boolean;
}
interface UserProfileComment {
	followers_count: number;
	id: number;
	profile_image: string;
	is_verified: boolean;
}

interface User {
	date_joined: Date;
	email: string;
	id: number;
	is_superuser: boolean;
	last_login: Date | null;
	first_name: string | null;
	last_name: string | null;
	username: string;
	full_name: string;
	userprofile: UserProfileUser;
}

interface UserProfile {
	bio: string | null;
	birth_date: string | null;
	followers_count: number;
	following_count: number;
	id: number;
	location: string | null;
	profile_image: string | null;
	user: User;
	is_following: boolean;
	is_mine: boolean;
	posts_count: number;
	is_verified: boolean;
}

interface CommentType {
	content: string;
	replies_count: number;
	created_at: Date;
	id: number;
	parent: null;
	post: string;
	post_user_id: number;
	reply_to: null | number;
	user: string;
	user_profile: UserProfileComment;
	reply_to_username?: string;
	user_id: number;
	post_id: number;
	top_level_parent_id: number;
	is_liked_by_me: boolean;
	is_mine: boolean;
	likes_count: number;
	pinned: boolean;
}
interface AppErrors {
	postError: string;
	commentDeleteError: string;
	commentPostError: string;
	serverError: string;
}

interface SavedPost {
	id: number;
	post: SimplePost;
	user_profile: number;
}

interface SimplePost {
	id: number;
	image: string;
	likes_count: number;
	title: string;
	user: number;
}
