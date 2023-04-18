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
	userprofile: Partial<Userprofile>;
}

// interface Userprofile {
// 	followers_count: number;
// 	id: number;
// 	profile_image: null | string;
// }

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
}
