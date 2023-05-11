import React, { useContext, useEffect, useRef, useState } from "react";
import PostOptionsModal from "../components/PostOptionsModal";
import CommentOptionsModal from "../components/CommentOptionsModal";
import { CommentActions } from "../reducers/CommentsReducer";
import ProfileEditor from "../components/ProfileEditor/ProfileEditor";

// type ModalType = "POST_OPTIONS" | "COMMENT_OPTIONS" | "PROFILE_IMAGE_EDITOR";
export enum ModalType {
	POST_OPTIONS = "POST_OPTIONS",
	COMMENT_OPTIONS = "COMMENT_OPTIONS",
	PROFILE_IMAGE_EDITOR = "PROFILE_IMAGE_EDITOR",
}
interface PostOptionsPayload {
	type: ModalType.POST_OPTIONS;
	post: PostType;
}

interface CommentOptionsPayload {
	type: ModalType.COMMENT_OPTIONS;
	comment: CommentType;
	commentDispatchFn: React.Dispatch<CommentActions>;
}

interface ProfileImageEditorPayload {
	type: ModalType.PROFILE_IMAGE_EDITOR;
	userProfileDispatch: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

type ModalPayload =
	| PostOptionsPayload
	| CommentOptionsPayload
	| ProfileImageEditorPayload;

interface ModalContextType {
	showModal: (settings: ModalPayload) => void;
	hideModal: () => void;
}

const ModalContext = React.createContext<ModalContextType>({
	showModal: () => {},
	hideModal: () => {},
});

interface ModalProviderProps {
	children: React.ReactElement | React.ReactElement[];
}
const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
	const [modalPayload, setModalPayload] = useState<ModalPayload | null>(null);

	const showModal = (settings: ModalPayload) => {
		setModalPayload(settings);
	};
	const hideModal = () => {
		setModalPayload(null);
	};

	useEffect(() => {
		if (modalPayload && modalPayload?.type) {
			document.body.classList.add("!overflow-hidden");
		} else {
			document.body.classList.remove("!overflow-hidden");
		}
	}, [modalPayload]);

	return (
		<ModalContext.Provider value={{ showModal, hideModal }}>
			{children}

			{modalPayload?.type === ModalType.POST_OPTIONS && (
				<PostOptionsModal post={modalPayload.post} />
			)}

			{modalPayload?.type === ModalType.COMMENT_OPTIONS && (
				<CommentOptionsModal
					commentDispatch={modalPayload.commentDispatchFn}
					comment={modalPayload.comment}
				/>
			)}

			{modalPayload?.type === ModalType.PROFILE_IMAGE_EDITOR && (
				<ProfileEditor userProfileDispatch={modalPayload.userProfileDispatch} />
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
