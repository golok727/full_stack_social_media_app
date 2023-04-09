import axios from "axios";
import { FormEvent, useState } from "react";
import useAuth from "../hooks/useAuth";
const CreatePost = () => {
	const [image, setImage] = useState<File | null>(null!);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const { auth } = useAuth();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		let formData = new FormData();
		if (image && title && description) {
			formData.append("image", image, image.name);
			formData.append("title", title);
			formData.append("description", description);

			const url = "http://127.0.0.1:8000/api/posts/";

			try {
				const res = await axios.post(url, formData, {
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
		<div className="pt-20">
			<form onSubmit={handleSubmit}>
				<p>
					<input
						type="text"
						placeholder="Title"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.currentTarget.value)}
						required
					/>
				</p>
				<p>
					<textarea
						placeholder="description"
						id="description"
						value={description}
						onChange={(e) => setDescription(e.currentTarget.value)}
						required
					/>
				</p>
				<p>
					<input
						type="file"
						id="image"
						accept="image/png, image/jpeg"
						onChange={(e) =>
							setImage(() => (e.target.files ? e.target.files[0] : null))
						}
						required
					/>
				</p>
				<input className="text-white" type="submit" />
			</form>
		</div>
	);
};

export default CreatePost;
