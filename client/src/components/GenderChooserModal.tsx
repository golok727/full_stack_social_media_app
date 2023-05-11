import React, { useState } from "react";
import { useModal } from "../context/ModalProvider";
import { AccountState } from "../pages/EditAccount";

type GenderChooserProps = {
	gender: Gender;
	accountStateDispatch: React.Dispatch<React.SetStateAction<AccountState>>;
};
const genders: Gender[] = ["Male", "Female", "Prefer Not To Say"];

const GenderChooserModal: React.FC<GenderChooserProps> = ({
	gender,
	accountStateDispatch,
}) => {
	const { hideModal } = useModal();
	const [currentGender, setCurrentGender] = useState<Gender>(gender);

	const stopPropagation = (event: React.MouseEvent) => {
		event.stopPropagation();
	};
	const handleOnGenderChange = (gender: Gender) => {
		setCurrentGender(gender);
	};
	const handleGenderConfirm = () => {
		hideModal();
		if (gender === currentGender) return;
		accountStateDispatch((prev) => ({ ...prev, gender: currentGender }));
	};

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-70 text-white  flex justify-center items-center"
			onClick={() => hideModal()}
		>
			<div
				className="w-[20em] bg-neutral-900 rounded-md overflow-hidden "
				onClick={(e) => stopPropagation(e)}
			>
				{genders.map((gender, idx) => (
					<button
						key={idx}
						onClick={() => handleOnGenderChange(gender)}
						className="hover:bg-neutral-700 py-2 px-3 cursor-pointer block w-full text-left"
					>
						<input
							className="cursor-pointer"
							readOnly={true}
							checked={currentGender === gender}
							type="radio"
							name={gender}
							id={gender.replace(" ", "").toLowerCase()}
						/>
						<span className="ml-3 font-bold">{gender}</span>
					</button>
				))}

				<button
					onClick={() => handleGenderConfirm()}
					className="bg-violet-800 hover:bg-violet-700 font-bold 0 py-2 px-3  w-full"
				>
					Confirm
				</button>
			</div>
		</div>
	);
};

export default GenderChooserModal;
