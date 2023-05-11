import { ChangeEventHandler, useState } from "react";

const FileChooser = ({
	onChange,
	text = "Choose A File",
}: {
	onChange?: ChangeEventHandler<HTMLInputElement>;

	text?: string;
}) => {
	return (
		<div>
			<label
				htmlFor="file-input"
				className={`block hover:bg-violet-800 font-bold py-2 px-3 rounded cursor-pointer scale-110  bg-violet-600
				 `}
			>
				{text}
				<input
					onChange={onChange}
					id="file-input"
					type="file"
					className="hidden"
				/>
			</label>
		</div>
	);
};

export default FileChooser;
