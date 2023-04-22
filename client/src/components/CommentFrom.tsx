import React, { FormEvent, forwardRef, useState } from "react";
import SmileIcon from "../icons/Smile";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import {
	CommentActionTypes,
	CommentActions,
} from "../reducers/CommentsReducer";

interface Props {
	postId: number;
	replyToUserName: string | null;
	commentId?: number;
	parent: number | null;
	reply_to: number | null;
	dispatch?: React.Dispatch<CommentActions>;
	resetReplyingToState: () => void;
}

const CommentForm: React.ForwardRefRenderFunction<
	HTMLTextAreaElement,
	Props
> = (
	{ postId, dispatch, reply_to, parent, replyToUserName, resetReplyingToState },
	ref
) => {
	// States
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
			const data = res.data.comment as CommentType;

			if (data && dispatch !== undefined && !parent && !reply_to) {
				dispatch({
					type: CommentActionTypes.ADD_COMMENT,
					payload: {
						comment: data,
					},
				});
			}

			if (
				data &&
				dispatch !== undefined &&
				parent &&
				reply_to &&
				data.top_level_parent_id
			) {
				dispatch({
					type: CommentActionTypes.ADD_REPLY,
					payload: {
						commentId: data.top_level_parent_id,
						reply: data,
					},
				});
			}

			resetReplyingToState();
			setCommentContent("");
		} catch (error: any) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="">
			{replyToUserName && (
				<div className="mb-2 w-fit flex items-center gap-2 bg-gradient-to-r from-violet-900 to to-pink-700 rounded-full py-1 px-2 font-bold transition-all duration-150">
					<span className="block text-xs w-fit text-white">
						Replying to
						<Link to={"/" + replyToUserName}> @{replyToUserName}</Link>
					</span>
					{/* Close Reply */}
					<span
						className="cursor-pointer"
						onClick={() => resetReplyingToState()}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 inline-block hover:scale-95"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</span>
				</div>
			)}
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
					placeholder={`Add a comment for `}
				/>
				<input
					type="submit"
					disabled={isLoading || commentContent === ""}
					className="font-bold text-blue-200 text-sm cursor-pointer disabled:text-gray-700 disabled:cursor-not-allowed transition-colors duration-200"
					value={!isLoading ? "Post" : "Posting..."}
				/>
			</form>
		</div>
	);
};

export default forwardRef(CommentForm);
