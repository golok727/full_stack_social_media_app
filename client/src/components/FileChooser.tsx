import { ChangeEventHandler } from "react";

const FileChooser = ({
	onChange,
}: {
	onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
	return (
		<label
			htmlFor="file-input"
			className="block bg-violet-600 hover:bg-violet-800 font-bold py-2 px-3 rounded cursor-pointer  "
		>
			Choose A File
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
