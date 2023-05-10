import React, { FormEvent, useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import SpinnerLoader from "./SpinnerLoader";
import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

const CreatePost = () => {
	// Form States
	const [image, setImage] = useState<File | null>(null!);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const titleLength = useMemo(() => title.length, [title]);

	// Hooks
	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();

	// Fetch States
	const [isLoading, setIsLoading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isSuccess, setIsSuccess] = useState(false);

	const [errorMsg, setErrorMsg] = useState("");

	// Handle Submit

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		let formData = new FormData();

		if (!title) {
			setErrorMsg("A Title is required");
			return;
		}

		if (title.length > 100) {
			setErrorMsg("The Title should be less than 100 characters");
			return;
		}
		if (description.length > 5000) {
			setErrorMsg("The description should be less than 5000 characters");
			return;
		}

		if (!image) {
			setErrorMsg("An Image is required");
			return;
		}

		if (image && title) {
			formData.append("image", image, image.name);
			formData.append("title", title);
			formData.append("description", description);

			try {
				setIsLoading(true);
				const res = await axiosPrivate.post("/api/posts/", formData, {
					onUploadProgress: (progressEvent) => {
						if (progressEvent.total) {
							setUploadProgress(
								Math.round((progressEvent.loaded / progressEvent.total) * 100)
							);
						}
					},
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				setIsSuccess(true);
				console.log(res.data);
				setImage(null);
				setTitle("");
				setDescription("");
			} catch (error) {
				setErrorMsg("Something went wrong");
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	useEffect(() => {
		setErrorMsg("");
	}, [title, image]);

	useEffect(() => {
		useDocumentTitle("Create | Photon");
	}, []);
	// handle Component UnMount

	return (
		<div className="pt-24 container mx-auto max-w-4xl">
			<form
				onSubmit={handleSubmit}
				className="flex justify-center items-center flex-col"
			>
				{errorMsg && (
					<p className="text-center text-red-500 font-bold tracking-tight text-sm pb-4">
						{errorMsg}
					</p>
				)}

				{isSuccess && (
					<div className="flex flex-col gap-3 items-center text-center font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 transition-all my-10">
						<div className="border-[3px] w-fit p-3 rounded-full border-purple-700 ">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="white"
								className="w-10 h-10 stroke-purple-800 inline-block"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4.5 12.75l6 6 9-13.5"
								/>
							</svg>
						</div>
						<span>Upload Complete</span>

						<br />
						{/* Link to Home */}
						<GoHome />
						<CreateAnotherPost setSuccess={setIsSuccess} />
					</div>
				)}

				{isLoading && (
					<div className="text-white transition-all my-10">
						<SpinnerLoader />
						<span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to to-pink-600">
							{"Uploading " + uploadProgress + "%"}
						</span>
					</div>
				)}

				{!isSuccess && !isLoading && (
					<div className="border-[1px] rounded border-gray-700 md:w-1/2 w-3/4 px-3 py-2 text-white ">
						<div className=" flex items-center">
							<input
								type="text"
								placeholder="Title"
								id="title"
								value={title}
								onChange={(e) => {
									setTitle(e.currentTarget.value);
								}}
								required
								className="w-full px-3 py-2 bg-transparent outline-none placeholder:text-slate-500 text-sm"
							/>
							{/* Title Length */}
							<div>
								{titleLength > 0 && (
									<span
										className={`
									 text-xs ${
											titleLength > 100
												? "text-red-500 font-bold -bottom-7"
												: "text-violet-300 "
										} transition-all duration-150`}
									>
										{titleLength}
									</span>
								)}
							</div>
						</div>
						<span className="w-full h-[1px] bg-slate-700 block"></span>
						<div className="">
							<textarea
								placeholder="Write a caption for your post..."
								id="description"
								value={description}
								onChange={(e) => setDescription(e.currentTarget.value)}
								rows={7}
								className="w-full px-3 py-2 bg-transparent outline-none resize-none placeholder:text-slate-500 text-sm"
							/>
						</div>

						<span className="w-full h-[1px] bg-slate-700 block "></span>

						{/* DropZone */}
						<DropZone
							setErrorMsg={setErrorMsg}
							setImage={setImage}
							image={image}
						/>
						{/* DropZone */}

						<div className="flex justify-center py-3">
							<input
								className="font-bold py-2 px-3 rounded-full bg-green-700 cursor-pointer disabled:text-gray-500"
								type="submit"
								value={isLoading ? "Uploading..." : "Submit"}
								disabled={isLoading}
							/>
						</div>
					</div>
				)}
			</form>
		</div>
	);
};

interface DropZoneProps {
	setImage: React.Dispatch<React.SetStateAction<File | null>>;
	image: File | null;
	setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
}

function DropZone({ setImage, setErrorMsg, image }: DropZoneProps) {
	// Drag drop

	const [isDragging, setIsDragging] = useState(false);
	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		const imageFile = e.dataTransfer.files[0];
		const mimeTypes = [
			"image/jpeg",
			"image/png",
			"image/gif",
			"image/bmp",
			"image/tiff",
			"image/webp",
			"image/svg+xml",
		];
		if (mimeTypes.includes(imageFile.type)) {
			setImage(imageFile);
		} else {
			setImage(null);
			setErrorMsg("File type: " + imageFile.type + " is not allowed for now");
		}
		// Do something with the files
	};

	return (
		<div
			className="py-3"
			onDragEnter={handleDragEnter}
			onDragOver={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<label
				htmlFor="dropzone-file"
				className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 ${
					isDragging ? "border-dashed" : "border-solid"
				} rounded-lg cursor-pointer bg-gray-50  dark:bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-950`}
			>
				<div
					className={`${
						image === null ? "flex" : "hidden"
					} flex-col items-center justify-center pt-5 pb-6`}
				>
					<svg
						aria-hidden="true"
						className="w-10 h-10 mb-3 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						></path>
					</svg>
					<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
						<span className="font-semibold">Click to upload</span> or drag and
						drop
					</p>
					<p className="text-xs text-gray-500 dark:text-gray-400">
						SVG, PNG, JPG or GIF (MAX. 800x400px)
					</p>
				</div>

				<div
					className={`max-h-36 object-contain ${image ? "block" : "hidden"}`}
				>
					<span>Selected: </span>{" "}
					<span className="font-bold"> {image?.name} </span>
				</div>

				<input
					id="dropzone-file"
					type="file"
					className="hidden"
					onChange={(e) => {
						setImage(
							e.target.files && e.target.files.length > 0
								? e.target.files[0]
								: null
						);
					}}
				/>
			</label>
		</div>
	);
}

function CreateAnotherPost({
	setSuccess,
}: {
	setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<span
			className="cursor-pointer underline font-light flex items-center gap-1"
			onClick={() => setSuccess(false)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke=""
				className="w-6 h-6 stroke-purple-700 inline-block"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>

			<span>Create Another Post</span>
		</span>
	);
}

function GoHome() {
	return (
		<span className="cursor-pointer underline font-light flex items-center gap-1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke=""
				className="w-6 h-6 stroke-purple-700 inline-block"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
				/>
			</svg>

			<Link to={"/"}>Home</Link>
		</span>
	);
}
export default CreatePost;
