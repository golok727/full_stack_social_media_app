import React, { useContext, useEffect, useState } from "react";
import PostOptionsModal from "../components/PostOptionsModal";
import CommentOptionsModal from "../components/CommentOptionsModal";

type ModalType = "POST_OPTIONS" | "COMMENT_OPTIONS";

interface ModalContextType {
	showModal: (
		modelType: ModalType,
		payload: {
			postId?: number;
			commentId?: number;
			commentPostId?: number;

			userId: number;
			isPinned?: boolean;
		}
	) => void;
	hideModal: () => void;
	modalType: ModalType | null;
}

const ModalContext = React.createContext<ModalContextType>({
	modalType: null,
	showModal: () => {},
	hideModal: () => {},
});

interface Props {
	children: React.ReactElement | React.ReactElement[];
}
const ModalProvider: React.FC<Props> = ({ children }) => {
	const [modalType, setModalType] = useState<ModalType | null>(null);
	const [postId, setPostId] = useState<number | null>(null);
	const [commentId, setCommentId] = useState<number | null>(null);
	const [userId, setUserId] = useState<number | null>(null);
	const [commentPostId, setCommentPostId] = useState<number | null>(null);
	const [isPinned, setIsPinned] = useState<boolean | null>(null);

	const showModal = (
		type: ModalType,
		payload: {
			postId?: number;
			commentPostId?: number;
			commentId?: number;
			userId: number;
			isPinned?: boolean;
		}
	) => {
		setModalType(type);
		setPostId(payload.postId || null);
		setUserId(payload.userId);
		setCommentId(payload.commentId || null);
		setIsPinned(isPinned || null);
		setCommentPostId(commentPostId || null);
	};

	const hideModal = () => {
		setModalType(null);
	};

	useEffect(() => {
		if (modalType) {
			document.body.classList.add("!overflow-hidden");
		} else {
			document.body.classList.remove("!overflow-hidden");
		}
	}, [modalType]);

	return (
		<ModalContext.Provider value={{ modalType, showModal, hideModal }}>
			{children}
			{modalType === "POST_OPTIONS" && (
				<PostOptionsModal postId={postId!} userId={userId!} />
			)}
			{modalType === "COMMENT_OPTIONS" && (
				<CommentOptionsModal
					userId={userId!}
					commentId={commentId!}
					commentPostId={commentPostId!}
				/>
			)}
		</ModalContext.Provider>
	);
};

const useModal = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within a ModalProvider context");
	}
	return context;
};

export { ModalProvider, useModal };
