import { useEffect, useState } from "react";
import { useModal } from "../../context/ModalProvider";
import Close from "../../icons/Close";
import FileChooser from "../FileChooser";
import EditorCanvas from "./EditorCanvas";

const ProfileEditor = () => {
	const { hideModal } = useModal();
	const [image, setImage] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState("");
	const [currStep, setCurrStep] = useState<"CHOOSE" | "EDIT" | "SUBMIT">(
		"CHOOSE"
	);

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

				{/* {imageUrl !== "" && (
					<div>
						<img src={imageUrl} alt="" />
					</div>
				)} */}

				{currStep === "CHOOSE" && (
					<FileChooser
						onChange={(e) => {
							setImage(
								e.target.files && e.target.files.length > 0
									? e.target.files[0]
									: null
							);
						}}
					/>
				)}

				{currStep === "EDIT" && <EditorCanvas imageUrl={imageUrl} />}
			</div>
		</div>
	);
};

export default ProfileEditor;
