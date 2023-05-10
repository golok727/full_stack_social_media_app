import { HTMLAttributes } from "react";
import Camera from "../../icons/Camera";
interface EditProfileImageRoundProps extends HTMLAttributes<HTMLDivElement> {
	src: string;
	alt?: string;
}
const EditProfileImageRound = ({
	src,
	alt = "image",
	...props
}: EditProfileImageRoundProps) => {
	return (
		<div
			{...props}
			className="w-32 h-32 rounded-full overflow-hidden cursor-pointer group relative select-none"
		>
			<img src={src} className=" w-full h-full object-cover" alt={alt} />
			<div className="absolute inset-0 bg-black bg-opacity-60 transition-all hidden group-hover:flex justify-center items-center">
				<Camera />
			</div>
		</div>
	);
};

export default EditProfileImageRound;
