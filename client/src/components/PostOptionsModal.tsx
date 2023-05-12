import React, { MouseEventHandler, useState } from "react";
import Close from "../icons/Close";
import { useModal } from "../context/ModalProvider";
import useAuth from "../hooks/useAuth";
import CpuChip from "../icons/CpuChip";
import Report from "../icons/Report";
import { UNSAFE_DataRouterStateContext, useNavigate } from "react-router-dom";
interface Props {
	post: PostType;
}

const PostOptionsModal: React.FC<Props> = ({ post }) => {
	const { hideModal } = useModal();
	const { auth } = useAuth();
	const navigate = useNavigate();
	const stopPropagation = (event: React.MouseEvent) => {
		event.stopPropagation();
	};

	const handleAboutThisAccount = () => {
		navigate("/" + post.user.username);
		hideModal();
	};

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-70 text-white  flex justify-center items-center transition-all "
			onClick={() => hideModal()}
		>
			<div
				className="w-[20em] bg-neutral-900 rounded-md overflow-hidden"
				onClick={(e) => stopPropagation(e)}
			>
				{post.user.id === auth.user?.id && (
					<>
						<DeleteButton onConfirm={() => {}} />

						<button className="w-full py-3 px-2 hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700">
							Edit
						</button>

						<button className="w-full py-3 px-2 hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700">
							Hide Likes
						</button>
					</>
				)}

				{post.user.id !== auth.user?.id && (
					<button className="flex justify-center items-center  gap-2 w-full py-3 px-2 text-red-500 font-bold hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700">
						<Report />
						Report
					</button>
				)}

				{auth.user?.is_superuser && (
					<button className="flex justify-center items-center gap-2 w-full py-3 px-2 font-bold text-purple-500 hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700">
						<CpuChip />
						Disable Post
					</button>
				)}

				<button className="w-full py-3 px-2 hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700">
					Add To Favorites
				</button>

				<button className="w-full py-3 px-2 hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700">
					Share To
				</button>

				<button
					onClick={() => handleAboutThisAccount()}
					className="w-full py-3 px-2 hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700"
				>
					About This Account
				</button>

				<button
					onClick={() => hideModal()}
					className="w-full py-3 px-2 hover:bg-neutral-800 transition-colors"
				>
					Cancel
				</button>
			</div>
		</div>
	);
};

export const DeleteButton = ({
	onConfirm,
}: {
	onConfirm: MouseEventHandler<HTMLButtonElement>;
}) => {
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	return (
		<>
			{!showDeleteConfirmation && (
				<button
					onClick={() => setShowDeleteConfirmation(true)}
					className="w-full py-3 px-2 text-red-500 font-bold hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700"
				>
					Delete
				</button>
			)}

			{showDeleteConfirmation && (
				<div className="flex">
					<button
						onClick={onConfirm}
						className="w-full py-3 px-2 text-red-500 font-bold hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700 border-r-[1px] border-r-gray-700"
					>
						Confirm
					</button>

					<button
						onClick={() => setShowDeleteConfirmation(false)}
						className="w-full py-3 px-2 text-green-400 font-bold hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700"
					>
						Go Back
					</button>
				</div>
			)}
		</>
	);
};

export default PostOptionsModal;
