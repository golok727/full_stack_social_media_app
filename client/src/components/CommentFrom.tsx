import React, { FormEvent, forwardRef, useState } from "react";
import SmileIcon from "../icons/Smile";
import { CommentActionTypes, CommentActions } from "../pages/PostPage";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

interface Props {
	postId: number;
	dispatch?: React.Dispatch<CommentActions>;
	commentId?: number;
	parent: number | null;
	reply_to: number | null;
}

const CommentForm: React.ForwardRefRenderFunction<
	HTMLTextAreaElement,
	Props
> = ({ postId, dispatch, reply_to, parent }, ref) => {
	const [textAreaHeightValue, setTextAreaHeightValue] = useState("10");
	const [limit, setLimit] = useState(false);
	const [commentContent, setCommentContent] = useState("");
	const axiosPrivate = useAxiosPrivate();
	const [isLoading, setIsLoading] = useState(false);

	// Todo Add global error handling to show comment Error
	const addComment = async (e: FormEvent) => {
		e.preventDefault();

		try {
			setIsLoading(true);
			const reqData = {
				content: commentContent,
				...(reply_to && { reply_to }),
				...(parent && { parent }),
			};

			console.log(reqData);

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
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={addComment} className="flex gap-2 items-center ">
			<div>
				<SmileIcon />
			</div>
			<textarea
				readOnly={isLoading}
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
				className={`flex-1 bg-transparent placeholder:text-sm read-only:text-gray-400 placeholder:text-gray-400 text-sm resize-none ${
					limit ? "overflow-y-auto" : "overflow-hidden"
				} outline-none text-xs`}
				placeholder="Add a comment"
			/>
			<input
				type="submit"
				disabled={isLoading || commentContent === ""}
				className="font-bold text-blue-200 text-sm cursor-pointer disabled:text-gray-700 disabled:cursor-not-allowed transition-colors duration-200"
				value={!isLoading ? "Post" : "Posting..."}
			/>
		</form>
	);
};

export default forwardRef(CommentForm);
