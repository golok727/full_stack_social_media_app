import React, { useContext, useEffect, useState } from "react";
import CommentOptionsModal from "../components/CommentOptionsModal";
import GenderChooserModal from "../components/GenderChooserModal";
import PostOptionsModal from "../components/PostOptionsModal";
import ProfileEditor from "../components/ProfileEditor/ProfileEditor";
import { AccountState } from "../pages/EditAccount";
import { CommentActions } from "../reducers/CommentsReducer";

// type ModalType = "POST_OPTIONS" | "COMMENT_OPTIONS" | "PROFILE_IMAGE_EDITOR";
export enum ModalType {
	POST_OPTIONS = "POST_OPTIONS",
	COMMENT_OPTIONS = "COMMENT_OPTIONS",
	PROFILE_IMAGE_EDITOR = "PROFILE_IMAGE_EDITOR",
	GENDER_CHANGER = "GENDER_CHANGER",
}
interface PostOptionsPayload {
	type: ModalType.POST_OPTIONS;
	post: PostType;
}

interface GenderChangerPayload {
	type: ModalType.GENDER_CHANGER;
	accountStateDispatch: React.Dispatch<React.SetStateAction<AccountState>>;
	gender: Gender;
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
	| ProfileImageEditorPayload
	| GenderChangerPayload;

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

		const handleCloseOnEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") hideModal();
		};
		const handlePopState = () => {
			hideModal();
		};

		if (modalPayload) {
			document.addEventListener("keyup", handleCloseOnEscape);
			window.addEventListener("popstate", handlePopState);
		}

		return () => {
			document.removeEventListener("keydown", handleCloseOnEscape);
			window.removeEventListener("popstate", handlePopState);
		};
	}, [modalPayload]);

	return (
		<ModalContext.Provider value={{ showModal, hideModal }}>
			{children}

			{modalPayload?.type === ModalType.POST_OPTIONS && (
				<PostOptionsModal post={modalPayload.post} />
			)}

			{modalPayload?.type === ModalType.GENDER_CHANGER && (
				<GenderChooserModal
					accountStateDispatch={modalPayload.accountStateDispatch}
					gender={modalPayload.gender}
				/>
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
