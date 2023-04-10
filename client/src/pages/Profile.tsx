import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";

const Profile = () => {
	const { username } = useParams();
	const { auth } = useAuth();
	const [userProfile, setUserProfile] = useState<any>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		if (username === auth.user?.username) {
			isMounted &&
				setUserProfile((prev: any) => ({ ...prev, user: { ...auth.user } }));

			setIsLoading(false);
		}

		setIsLoading(false);
		return () => {
			isMounted = false;
		};
	}, []);
	console.log(userProfile);
	return (
		<div className="pt-20  text-white container mx-auto max-w-4xl">
			{!isLoading ? (
				userProfile.user ? (
					<div className="flex flex-col items-center">
						<header>{userProfile.user.username}</header>
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
