import React, { FormEvent, forwardRef, useState } from "react";
import SmileIcon from "../icons/Smile";
import { CommentActions } from "../pages/PostPage";

interface Props {
	postId: number;
	dispatch: React.Dispatch<CommentActions>;
	commentId?: number;
	parentCommentId?: number;
}

const CommentForm: React.ForwardRefRenderFunction<
	HTMLTextAreaElement,
	Props
> = ({ postId }, ref) => {
	const [textAreaHeightValue, setTextAreaHeightValue] = useState("10");
	const [limit, setLimit] = useState(false);
	const [commentContent, setCommentContent] = useState("");
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
				onChange={(e) => setCommentContent(e.currentTarget.value)}
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
				disabled={commentContent === ""}
				className="font-bold text-blue-200 text-sm cursor-pointer disabled:text-gray-700 disabled:cursor-not-allowed transition-colors duration-200"
				value={"Post"}
			/>
		</form>
	);
};

export default forwardRef(CommentForm);
