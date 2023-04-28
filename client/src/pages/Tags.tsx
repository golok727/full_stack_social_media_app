import { useParams } from "react-router-dom";

const Tags = () => {
	const { tag } = useParams();
	return <div className="py-20 text-white">Tags : {tag}</div>;
};

export default Tags;
