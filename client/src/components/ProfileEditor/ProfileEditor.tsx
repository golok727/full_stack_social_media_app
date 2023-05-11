import React, { useEffect, useState } from "react";
import { useModal } from "../../context/ModalProvider";
import Close from "../../icons/Close";
import FileChooser from "../FileChooser";
import EditorCanvas from "./EditorCanvas";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

type ProfileEditorProps = {
	userProfileDispatch: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};

const ProfileEditor: React.FC<ProfileEditorProps> = ({
	userProfileDispatch,
}) => {
	const { hideModal } = useModal();
	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();

	const [isProfilePictureUploadLoading, setProfilePictureUploading] =
		useState(false);

	const [image, setImage] = useState<File | null>(null);
	const [croppedImage, setCroppedImage] = useState<File | null>(null);

	const [imageUrl, setImageUrl] = useState("");
	const [currStep, setCurrStep] = useState<
		"CHOOSE" | "EDIT" | "PREVIEW" | "UPLOADING" | "COMPLETE"
	>("CHOOSE");

	const [previewImage, setPreviewImage] = useState<HTMLImageElement | null>(
		null
	);

	const handleProfileImageCropSave = async (image: HTMLImageElement) => {
		setPreviewImage(image);

		setCurrStep("PREVIEW");
	};

	const convertPreviewImageToFile = (): Promise<File | null> => {
		return new Promise((resolve) => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			if (!ctx) {
				resolve(null);
				return;
			}

			canvas.width = previewImage?.width || 0;
			canvas.height = previewImage?.height || 0;
			ctx.drawImage(previewImage!, 0, 0);

			canvas.toBlob((blob) => {
				if (!blob) {
					resolve(null);
					return;
				}

				const file = new File([blob], "previewImage.png");
				resolve(file);
			}, "image/png");
		});
	};

	const handleImageUpload = async () => {
		try {
			if (!previewImage) return;

			const formData = new FormData();

			if (!croppedImage) return;
			formData.append("profile_image", croppedImage);

			setProfilePictureUploading(true);

			const res = await axiosPrivate.put(
				`/api/users/profile/${auth.user?.username}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			userProfileDispatch(() => res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setProfilePictureUploading(false);
			hideModal();
		}
	};

	useEffect(() => {
		if (previewImage) {
			const convertImageToFile = async () => {
				const file = await convertPreviewImageToFile();
				setCroppedImage(file);
			};
			convertImageToFile();
		}
	}, [previewImage]);
	useEffect(() => {
		if (image) {
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				setImageUrl(reader.result as string);
			});
			reader.readAsDataURL(image);

			setCurrStep("EDIT");
		}
	}, [image]);

	return (
		<div className="fixed inset-0 text-white flex justify-center items-center transition-all duration-1000">
			<div className="flex justify-center items-center w-[60em] h-[40em] max-w-full mx-2 bg-black rounded bg-opacity-50 backdrop-blur-sm border-[1px] border-neutral-700 relative">
				<div className="absolute top-3 right-3">
					<Close onClick={() => hideModal()} />
				</div>

				{currStep === "CHOOSE" && (
					<FileChooser
						text="Choose an Image"
						onChange={(e) => {
							setImage(
								e.target.files && e.target.files.length > 0
									? e.target.files[0]
									: null
							);
						}}
					/>
				)}

				{currStep === "EDIT" && (
					<div className="">
						<EditorCanvas
							onSave={handleProfileImageCropSave}
							imageUrl={imageUrl}
						/>
					</div>
				)}

				{currStep === "PREVIEW" && (
					<div className="flex flex-col">
						<div className="rounded-full w-32 h-32 overflow-hidden">
							{previewImage && (
								<img
									src={previewImage.src}
									className="w-full h-full object-cover"
									alt="Preview"
								/>
							)}
						</div>
						<button
							disabled={isProfilePictureUploadLoading}
							onClick={() => {
								handleImageUpload();
							}}
							className="block bg-gradient-to-r from-pink-700 to-violet-600 rounded px-3 py-1 my-4"
						>
							{isProfilePictureUploadLoading ? "Uploading.." : "Upload"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfileEditor;
