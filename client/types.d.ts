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

interface CommentType {
	author: string;
	content: string;
	created_at: Date;
	id: number;
	parent: null | number;
	post: string;
	reply_to: null | number;
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
	created_at: Date;
	id: number;
	parent: null;
	post: string;
	reply_to: null;
	user: string;
	user_profile: UserProfileComment;
}
