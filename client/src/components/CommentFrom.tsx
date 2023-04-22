import React, { FormEvent, forwardRef, useState } from "react";
import SmileIcon from "../icons/Smile";
import { CommentActionTypes, CommentActions } from "../pages/PostPage";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { comment } from "postcss";

interface Props {
	postId: number;
	dispatch?: React.Dispatch<CommentActions>;
	commentId?: number;
	parentCommentId?: number;
}

const CommentForm: React.ForwardRefRenderFunction<
	HTMLTextAreaElement,
	Props
> = ({ postId, dispatch }, ref) => {
	const [textAreaHeightValue, setTextAreaHeightValue] = useState("10");
	const [limit, setLimit] = useState(false);
	const [commentContent, setCommentContent] = useState("");
	const axiosPrivate = useAxiosPrivate();
	// Todo Add global error handling to show comment Error
	const addComment = async (e: FormEvent) => {
		e.preventDefault();

		try {
			const reqData = {
				content: commentContent,
			};

			const res = await axiosPrivate.post(
				`/api/posts/${postId}/comments/add`,
				reqData
			);

			if (res.data.comment && dispatch !== undefined) {
				dispatch({
					type: CommentActionTypes.ADD_COMMENT,
					payload: {
						comment: res.data.comment,
					},
				});
			}
			setCommentContent("");
		} catch (error: any) {
			console.log(error);
		}
	};

	return (
		<form onSubmit={addComment} className="flex gap-2 items-center ">
			<div>
				<SmileIcon />
			</div>
			<textarea
				ref={ref}
				value={commentContent}
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
					// console.log(e.currentTarget.scrollHeight);
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
