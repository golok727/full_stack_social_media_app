import React, { useContext, useEffect, useRef, useState } from "react";
import PostOptionsModal from "../components/PostOptionsModal";
import CommentOptionsModal from "../components/CommentOptionsModal";
import { CommentActions } from "../reducers/CommentsReducer";

type ModalType = "POST_OPTIONS" | "COMMENT_OPTIONS";

interface ModalContextType {
	showModal: (
		modelType: ModalType,
		payload: {
			post?: PostType;
			comment?: CommentType;
		},
		commentDispatchFn?: React.Dispatch<CommentActions>
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

	const [currentPost, setCurrentPost] = useState<PostType | null>(null);
	const [currentComment, setCurrentComment] = useState<CommentType | null>(
		null
	);

	const commentDispatchFnRef = useRef<React.Dispatch<CommentActions>>();

	const showModal = (
		type: ModalType,
		payload: {
			post?: PostType;
			comment?: CommentType;
		},
		commentDispatchFn?: React.Dispatch<CommentActions>
	) => {
		setModalType(type);
		commentDispatchFnRef.current = commentDispatchFn!;
		setCurrentComment(payload.comment || null);
		setCurrentPost(payload.post || null);
	};

	const hideModal = () => {
		setModalType(null);
		setCurrentComment(null);
		setCurrentPost(null);
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
			{modalType === "POST_OPTIONS" && <PostOptionsModal post={currentPost!} />}
			{modalType === "COMMENT_OPTIONS" && (
				<CommentOptionsModal
					commentDispatch={commentDispatchFnRef.current!}
					comment={currentComment!}
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
