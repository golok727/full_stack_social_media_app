export interface PostType {
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
}

export interface User {
	date_joined: Date;
	email: string;
	first_name: string;
	id: number;
	is_superuser: boolean;
	last_login: Date | null;
	last_name: string;
	username: string;
}
