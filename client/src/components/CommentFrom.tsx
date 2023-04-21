import React, { FormEvent, forwardRef, useState } from "react";
import SmileIcon from "../icons/Smile";

interface Props {
	postId: number;
	commentId?: number;
	parentCommentId?: number;
}

const CommentForm: React.ForwardRefRenderFunction<
	HTMLTextAreaElement,
	Props
> = ({}, ref) => {
	const [textAreaHeightValue, setTextAreaHeightValue] = useState("10");
	const [limit, setLimit] = useState(false);

	const addComment = (e: FormEvent) => {
		e.preventDefault();
	};

	return (
		<form onSubmit={addComment} className="flex gap-2 items-center ">
			<div>
				<SmileIcon />
			</div>
			<textarea
				ref={ref}
				onInput={(e) => {
					if (!e.currentTarget.value) {
						setTextAreaHeightValue("auto");
						return;
					}
					if (e.currentTarget.scrollHeight >= 100) {
						setLimit(true);
						setTextAreaHeightValue(`100px`);
						return;
					}
					setTextAreaHeightValue("auto");
					setTextAreaHeightValue(`${e.currentTarget.scrollHeight}px`);
					console.log(e.currentTarget.scrollHeight);
				}}
				style={{
					height: textAreaHeightValue,
				}}
				className={`flex-1 bg-transparent placeholder:text-sm placeholder:text-gray-400 text-sm resize-none ${
					limit ? "overflow-y-auto" : "overflow-hidden"
				} outline-none text-xs`}
				placeholder="Add a comment"
			/>
			<input
				type="submit"
				className="font-bold text-blue-200 text-sm cursor-pointer"
				value={"Post"}
			/>
		</form>
	);
};

export default forwardRef(CommentForm);
