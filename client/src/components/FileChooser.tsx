import { ChangeEventHandler } from "react";

const FileChooser = ({
	onChange,
	text = "Choose A File",
}: {
	onChange: ChangeEventHandler<HTMLInputElement>;
	text?: string;
}) => {
	return (
		<label
			htmlFor="file-input"
			className="block bg-violet-600 hover:bg-violet-800 font-bold py-2 px-3 rounded cursor-pointer  "
		>
			{text}
			<input
				onChange={onChange}
				id="file-input"
				type="file"
				className="hidden"
			/>
		</label>
	);
};

export default FileChooser;
