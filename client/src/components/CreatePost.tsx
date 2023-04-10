import axios from "axios";
import React, { FormEvent, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const CreatePost = () => {
	const [image, setImage] = useState<File | null>(null!);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		let formData = new FormData();
		if (image && title && description) {
			formData.append("image", image, image.name);
			formData.append("title", title);
			formData.append("description", description);

			try {
				const res = await axiosPrivate.post("/api/posts/", formData, {
					headers: {
						"Content-Type": "multipart/form-data",

						Authorization: `Bearer ${auth.accessToken}`,
					},
				});
				const data = res.data;
				console.log(data);
			} catch (error) {
				alert("Something went wrong");
			}
		}
	};

	return (
		<div className="pt-20 container mx-auto max-w-4xl">
			<form
				onSubmit={handleSubmit}
				className="flex justify-center items-center flex-col"
			>
				<div className="border-[1px] rounded border-gray-700 md:w-1/2 w-3/4 px-3 py-2 text-white ">
					<div className="">
						<input
							type="text"
							placeholder="Title"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.currentTarget.value)}
							required
							className="w-full px-3 py-2 bg-transparent outline-none placeholder:text-slate-500 text-sm"
						/>
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
							required
						/>
					</div>

					<span className="w-full h-[1px] bg-slate-700 block "></span>

					{/* DropZone */}
					<DropZone setImage={setImage} image={image} />
					{/* DropZone */}

					<div className="flex justify-center py-3">
						<input
							className="font-bold py-2 px-3 rounded-full bg-green-700 cursor-pointer"
							type="submit"
							disabled={false}
						/>
					</div>
				</div>
			</form>
		</div>
	);
};

interface DropZoneProps {
	setImage: React.Dispatch<React.SetStateAction<File | null>>;
	image: File | null;
}

function DropZone({ setImage, image }: DropZoneProps) {
	return (
		<div className="py-3">
			<label
				htmlFor="dropzone-file"
				className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-950`}
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
							stroke-linecap="round"
							stroke-linejoin="round"
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

export default CreatePost;
