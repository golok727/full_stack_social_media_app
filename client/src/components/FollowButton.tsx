import React, { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

interface Props {
	is_following: boolean;
	userId: number;
	setUserProfile?: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

// Todo Make a post context and profile context to update the state according to the values

const FollowButton: React.FC<Props> = ({
	is_following,
	userId,
	setUserProfile,
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const [isFollowing, setIsFollowing] = useState(is_following);
	const axiosPrivate = useAxiosPrivate();
	const handleFollow = async () => {
		// Set loading to true on start
		setIsLoading(true);

		// Start to fetch
		try {
			if (!isFollowing) {
				await axiosPrivate.post(`/api/users/follow/${userId}`);
				setIsFollowing(true);
				// Add one Follower Count Update Ui
				if (setUserProfile) {
					setUserProfile(
						(prev: UserProfile | null) =>
							({
								...prev,
								followers_count: prev?.following_count
									? prev.followers_count + 1
									: prev?.following_count,
							} as UserProfile)
					);
				}
			} else {
				await axiosPrivate.post(`/api/users/unfollow/${userId}`);
				setIsFollowing(false);

				// Remove one Follower Count Update Ui
				if (setUserProfile) {
					setUserProfile(
						(prev: UserProfile | null) =>
							({
								...prev,
								followers_count: prev?.following_count
									? prev.followers_count - 1
									: prev?.following_count,
							} as UserProfile)
					);
				}
			}
		} catch (error) {
			setIsFollowing(is_following);
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button
			className={` ${
				isFollowing
					? "bg-gray-200 hover:bg-gray-300 text-black font-normal"
					: "bg-gradient-to-r from-violet-800 to bg-pink-500 hover:bg-blue-800 text-white"
			} rounded px-3 py-1  font-bold text-sm disabled:text-gray-500 disabled:bg-gray-700`}
			onClick={handleFollow}
			disabled={isLoading}
		>
			{isLoading ? (
				"Loading..."
			) : isFollowing ? (
				<span>Following</span>
			) : (
				<span>Follow</span>
			)}
		</button>
	);
};

export default FollowButton;
