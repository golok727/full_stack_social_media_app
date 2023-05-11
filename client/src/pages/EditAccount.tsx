import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useDocumentTitle from "../hooks/useDocumentTitle";
import SpinnerLoader from "../components/SpinnerLoader";
import EditProfileImageRound from "../components/ProfileEditor/EditProfileImageRound";
import VerifiedIcon from "../icons/VerifiedIcon";
import { ModalType, useModal } from "../context/ModalProvider";
import { CheckIcon } from "@heroicons/react/24/outline";

interface EditStatus {
	isUpdating: boolean;
	isUpdated: boolean;

	info: {
		error: boolean;
		msg: string;
	};
	edited: boolean;
}

const ACCOUNT_TYPE_CHOICES = [
	"Artist",
	"Entrepreneur",
	"Doctor",
	"Engineer",
	"Influencer",
	"Designer",
	"Photographer",
	"Writer",
	"Musician",
	"Chef",
	"Athlete",
	"Teacher",
	"Scientist",
	"Lawyer",
	"Student",
	"Investor",
	"Freelancer",
	"Journalist",
	"Consultant",
	"Traveler",
] as const;

type AccountType = (typeof ACCOUNT_TYPE_CHOICES)[number];
export interface AccountState {
	bio: string;
	gender: Gender;
	accountType: AccountType | null;
}

const EditAccount = () => {
	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();
	const { showModal } = useModal();
	const [editStatus, setEditStatus] = useState<EditStatus>({
		isUpdated: false,
		isUpdating: false,
		info: { error: false, msg: "" },
		edited: false,
	});

	const [isUserProfileDataLoading, setIsUserProfileDataLoading] =
		useState(true);
	//
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	const [accountState, setAccountState] = useState<AccountState>({
		bio: "",
		gender: "Prefer Not To Say",
		accountType: null,
	});

	const handleOnChange = (
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		e.persist();
		setAccountState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
	};

	const handleUpdateUserProfile = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = {
			...(userProfile?.bio !== accountState.bio && {
				bio: accountState.bio.slice(0, 125),
			}),
			...(userProfile?.gender !== accountState.gender && {
				gender: accountState.gender,
			}),
			...(userProfile?.account_type !== accountState.accountType && {
				account_type: accountState.accountType,
			}),
		};

		try {
			setEditStatus((prev) => ({
				...prev,
				edited: true,
				isUpdating: true,
				isUpdated: false,
			}));

			const res = await axiosPrivate.put(
				`/api/users/profile/${auth.user?.username}`,
				data
			);
			setUserProfile(res.data);
			setEditStatus((prev) => ({
				...prev,
				edited: true,
				isUpdating: false,
				isUpdated: true,
			}));
		} catch (error) {
			console.log(error);
		} finally {
			setEditStatus((prev) => ({
				...prev,
				edited: true,
				isUpdating: false,
				isUpdated: true,
			}));
		}
	};

	useEffect(() => {
		setEditStatus((prev) => ({
			...prev,
			edited: true,
			isUpdating: false,
			isUpdated: false,
		}));
	}, [accountState]);

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

				if (isMounted) {
					setUserProfile((prev) => ({ ...prev, ...res.data }));
					setAccountState((prev) => ({
						...prev,
						bio: res.data.bio || "",
						gender: res.data.gender || "",
						accountType: res.data.account_type,
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
						<form
							onSubmit={handleUpdateUserProfile}
							className="flex flex-col items-center"
						>
							{editStatus.isUpdated && (
								<div className="flex items-center border-[1px] border-purple-500 rounded-full py-1 px-3">
									<CheckIcon
										strokeWidth={3}
										className="inline-block text-purple-600 w-5 mr-2"
									/>{" "}
									<span className="fon text-purple-600">Updated</span>
								</div>
							)}

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
									onClick={() =>
										showModal({
											type: ModalType.GENDER_CHANGER,
											accountStateDispatch: setAccountState,
											gender: accountState.gender || "Prefer Not To Say",
										})
									}
									value={accountState.gender as string}
								></input>
							</div>
							<div className="flex flex-col justify-start mb-5 gap-3">
								<label className="font-bold capitalize" htmlFor="dob">
									DOB
								</label>
								<input
									// readOnly={userProfile?.birth_date !== null}
									readOnly={true}
									type="date"
									className="hover:text-gray-500  hover:border-gray-600 p-2 bg-transparent border-[1px] border-neutral-700 rounded flex-1 w-[400px]"
									name=""
									id="dob"
									value={userProfile?.birth_date || ""}
								/>
							</div>

							<div className="flex flex-col justify-start mb-5 gap-3">
								<label className="font-bold capitalize" htmlFor="bio">
									Account Type
								</label>

								<select
									name=""
									onChange={(ev) =>
										setAccountState((prev) => ({
											...prev,
											accountType: ev.target.value as AccountType,
										}))
									}
									className="p-2 bg-transparent border-[1px] border-neutral-700 rounded flex-1 w-full"
									id="account-type"
									value={accountState.accountType ?? "..."}
								>
									{ACCOUNT_TYPE_CHOICES.map((accountType, idx) => (
										<option key={idx} value={accountType} className="bg-black">
											{accountType}
										</option>
									))}
								</select>
							</div>

							<div className="mt-10">
								<input
									disabled={editStatus.isUpdating}
									className="py-2 px-3 bg-purple-600 font-bold cursor-pointer rounded-lg disabled:cursor-not-allowed"
									type="submit"
									value={editStatus.isUpdating ? "Updating..." : "Save"}
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
