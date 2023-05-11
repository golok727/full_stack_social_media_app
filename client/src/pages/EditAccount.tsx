import { ChangeEvent, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useDocumentTitle from "../hooks/useDocumentTitle";
import SpinnerLoader from "../components/SpinnerLoader";
import EditProfileImageRound from "../components/ProfileEditor/EditProfileImageRound";
import VerifiedIcon from "../icons/VerifiedIcon";
import { ModalType, useModal } from "../context/ModalProvider";

interface AccountState {
	bio: string;

	gender: string | null;
}
const EditAccount = () => {
	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();
	const { showModal } = useModal();
	const [editStatus, setEditStatus] = useState({
		isLoading: false,
		info: { error: false, msg: "" },
		edited: false,
	});

	const [isUserProfileDataLoading, setIsUserProfileDataLoading] =
		useState(true);
	//
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	const [accountState, setAccountState] = useState<AccountState>({
		bio: "",
		gender: "",
	});

	const handleOnChange = (
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		e.persist();

		setAccountState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
		setEditStatus((prev) => ({
			...prev,
			isLoading: false,
			info: { error: false, msg: "" },
			edited: true,
		}));
	};

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchUserProfile = async () => {
			setIsUserProfileDataLoading(true);

			try {
				const res = await axiosPrivate.get(
					`/api/users/profile/${auth.user?.username}`,
					{
						signal: controller.signal,
					}
				);

				console.log(res.data);
				if (isMounted) {
					setUserProfile((prev) => ({ ...prev, ...res.data }));
					setAccountState((prev) => ({
						...prev,
						bio: res.data.bio || "",
						gender: res.data.gender || "",
					}));
				}

				if (res.data?.user?.username) {
					useDocumentTitle(`Edit -> @${res.data?.user.username} | Photon`);
				}
			} catch (error: any) {
				if (error?.response?.status === 404) {
					setUserProfile(() => null);
				}
			} finally {
				setIsUserProfileDataLoading(false);
			}
		};
		fetchUserProfile();
		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	return (
		<div className="py-20 text-white mx-auto max-w-3xl">
			{isUserProfileDataLoading ? (
				<SpinnerLoader />
			) : (
				<div className="border-[1px] border-neutral-700 rounded-sm px-5 py-3">
					<header className="flex w-full gap-10 py-3">
						<EditProfileImageRound
							onClick={() =>
								showModal({
									type: ModalType.PROFILE_IMAGE_EDITOR,
									userProfileDispatch: setUserProfile,
								})
							}
							src={userProfile?.profile_image ?? ""}
							alt={userProfile?.user.username}
						/>
						<div className="flex-1 flex items-center">
							<span className="text-xl font-bol">
								@{userProfile?.user.username}
							</span>
							{userProfile?.is_verified && <VerifiedIcon />}
						</div>
					</header>

					<section>
						<form className="flex flex-col items-center">
							{/* Bio */}
							<div className="flex flex-col justify-start mb-5 gap-3">
								<label className="font-bold capitalize" htmlFor="bio">
									Bio
								</label>
								<textarea
									onChange={handleOnChange}
									className="p-2 bg-transparent border-[1px] border-neutral-700 rounded flex-1 w-[400px]"
									name=""
									id="bio"
									value={accountState.bio}
								></textarea>
							</div>

							{/* Gender */}
							<div className="flex flex-col  justify-start mb-5 gap-3">
								<label className="font-bold capitalize" htmlFor="gender">
									Gender
								</label>
								<input
									type="text"
									readOnly={true}
									className="hover:text-gray-500 hover:border-gray-600  p-2 bg-transparent border-[1px] border-neutral-700 rounded flex-1 w-[400px]"
									name=""
									id="gender"
									value={accountState.gender as string}
								></input>
							</div>

							<div className="flex flex-col  justify-start mb-5 gap-3">
								<label className="font-bold capitalize" htmlFor="dob">
									DOB
								</label>
								<input
									readOnly={userProfile?.birth_date !== null}
									type="date"
									className="hover:text-gray-500  hover:border-gray-600 p-2 bg-transparent border-[1px] border-neutral-700 rounded flex-1 w-[400px]"
									name=""
									id="dob"
									value={userProfile?.birth_date || ""}
								></input>
							</div>

							<div className="mt-10">
								<input
									disabled={!editStatus.edited}
									className="py-2 px-3 bg-purple-600 font-bold cursor-pointer rounded-lg disabled:bg-gray-600 disabled:line-through"
									type="submit"
									value="Save"
								/>
							</div>
						</form>
					</section>
				</div>
			)}
		</div>
	);
};

export default EditAccount;
