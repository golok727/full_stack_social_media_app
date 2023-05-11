import React, { useContext, useEffect, useRef, useState } from "react";
import PostOptionsModal from "../components/PostOptionsModal";
import CommentOptionsModal from "../components/CommentOptionsModal";
import { CommentActions } from "../reducers/CommentsReducer";
import ProfileEditor from "../components/ProfileEditor/ProfileEditor";

type ModalType = "POST_OPTIONS" | "COMMENT_OPTIONS" | "PROFILE_IMAGE_EDITOR";

interface ModalContextType {
	showModal: (
		modelType: ModalType,
		payload: {
			post?: PostType;
			comment?: CommentType;
			commentDispatchFn?: React.Dispatch<CommentActions>;
			userProfileDispatch?: React.Dispatch<
				React.SetStateAction<UserProfile | null>
			>;
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

	const [currentPost, setCurrentPost] = useState<PostType | null>(null);
	const [currentComment, setCurrentComment] = useState<CommentType | null>(
		null
	);

	const commentDispatchFnRef = useRef<React.Dispatch<CommentActions> | null>(
		null
	);
	const userProfileDispatchRef = useRef<React.Dispatch<
		React.SetStateAction<UserProfile | null>
	> | null>(null);

	const showModal = (
		type: ModalType,
		payload: {
			post?: PostType;
			comment?: CommentType;
			commentDispatchFn?: React.Dispatch<CommentActions>;
			userProfileDispatch?: React.Dispatch<
				React.SetStateAction<UserProfile | null>
			>;
		}
	) => {
		setModalType(type);
		commentDispatchFnRef.current = payload.commentDispatchFn!;
		userProfileDispatchRef.current = payload.userProfileDispatch!;
		setCurrentComment(payload.comment || null);
		setCurrentPost(payload.post || null);
	};

	const hideModal = () => {
		setModalType(null);
		setCurrentComment(null);
		setCurrentPost(null);

		commentDispatchFnRef.current = null;
		userProfileDispatchRef.current = null;
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

			{modalType === "PROFILE_IMAGE_EDITOR" && (
				<ProfileEditor userProfileDispatch={userProfileDispatchRef.current!} />
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
