import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Profile = () => {
	const { username } = useParams();
	const { auth } = useAuth();
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null!);
	const [isLoading, setIsLoading] = useState(true);
	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchUserProfile = async () => {
			setIsLoading(true);

			try {
				const res = await axiosPrivate.get(`/api/users/profile/${username}`, {
					signal: controller.signal,
				});
				setUserProfile((prev) => ({ ...prev, ...res.data }));
			} catch (error: any) {
				if (error?.response?.status === 404) {
					setUserProfile((prev) => null);
				}
			} finally {
				setIsLoading(false);
			}
		};
		isMounted && username && fetchUserProfile();
		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);
	console.log(userProfile);
	return (
		<div className="pt-20  text-white container mx-auto max-w-4xl">
			{!isLoading ? (
				userProfile ? (
					<div className="flex justify-center gap-2">
						{/* Header */}

						<header className="flex items-center gap-12">
							{/*Left  */}
							<div>
								{/* Avatar */}
								<AvatarMaker
									avatar={userProfile.profile_image}
									username={userProfile.user?.username}
								/>
							</div>

							{/* Right */}
							<div>
								{/* Username */}
								<header className="flex gap-3 items-center">
									<span className="text-xl ">
										@{userProfile.user?.username}
									</span>

									{(auth.user as User).id === userProfile.user.id ? (
										<Link
											to="/account/edit"
											className="bg-gray-100 text-black rounded-md p-2  text-sm font-bold hover:bg-gray-200 cursor-pointer"
										>
											Edit Profile
										</Link>
									) : (
										// Following Button
										<button
											className={` ${
												userProfile.is_following
													? "bg-gray-200 hover:bg-gray-300 text-black font-normal"
													: "bg-blue-600 hover:bg-blue-800 text-white"
											} rounded px-3 py-1  font-bold text-sm`}
											onClick={() => console.log("Follow")}
										>
											{userProfile.is_following ? (
												<span>Following</span>
											) : (
												<span>Follow</span>
											)}
										</button>
									)}
								</header>

								{/* Statics */}
								<section className="py-2">
									<div className="flex gap-3">
										{/* Posts Count */}
										<span className="text-sm">
											<span className="font-bold text-base mr-1">
												{userProfile.posts_count}
											</span>
											{userProfile.posts_count > 0 ? "Post" : "Posts"}
										</span>

										{/* Followers Count */}
										<span className="text-sm">
											<span className="font-bold text-base mr-1">
												{userProfile.followers_count}
											</span>
											{userProfile.followers_count > 0
												? "Followers"
												: "Follower"}
										</span>

										{/* Following Count */}
										<span className="text-sm">
											<span className="font-bold text-base mr-1">
												{userProfile.following_count}
											</span>
											Following
										</span>
									</div>
								</section>
							</div>
						</header>
					</div>
				) : (
					<Navigate to={"/404"} />
				)
			) : (
				<span>Loading...</span>
			)}
		</div>
	);
};

export default Profile;

function AvatarMaker({
	avatar,
	username,
}: {
	avatar: string | null;
	username: string;
}) {
	return avatar ? (
		<div className="w-32 h-32 rounded-full overflow-hidden border-[2px] border-red-600">
			<img className="object-contain" src={avatar} alt="" />
		</div>
	) : (
		<div
			className={`w-32 h-32 bg-orange-600 rounded-full text-white font-bold text-xs grid place-items-center select-none border-blue-200 border-[1px]`}
		>
			<span className="text-6xl">{username?.charAt(0).toUpperCase()}</span>
		</div>
	);
}
