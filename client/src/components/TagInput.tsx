import React, { useState } from "react";

interface TagInputProps {
	position: { top: number; left: number };
}

const TagInput: React.FC<TagInputProps> = ({ position }) => {
	const [inputValue, setInputValue] = useState("");
	const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);

		if (value.startsWith("#")) {
			fetchTagSuggestions(value.substring(1));
		}
	};

	const fetchTagSuggestions = async (text: string) => {
		// Send API request to fetch tag suggestions
		// Update the tagSuggestions state with the response data
		// Example:
		const suggestions = ["tag1", "tag2", "tag3"];
		setTagSuggestions(suggestions);
	};

	const handleTagSuggestionClick = (tag: string) => {
		setInputValue(`#${tag}`);
		setTagSuggestions([]);
	};

	return (
		<div>
			<input
				type="text"
				className="bg-transparent border-[1px] text-white"
				value={inputValue}
				onChange={handleInputChange}
			/>

			{tagSuggestions.length > 0 && (
				<ul
					style={{
						position: "absolute",
						top: position.top,
						left: position.left,
					}}
				>
					{tagSuggestions.map((tag, index) => (
						<li key={index} onClick={() => handleTagSuggestionClick(tag)}>
							{tag}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default TagInput;
