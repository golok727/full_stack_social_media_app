import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
interface EditorCanvasProps {
	imageUrl: string;
	onSave: (image: HTMLImageElement) => void;
}
const EditorCanvas = ({ imageUrl, onSave = () => {} }: EditorCanvasProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null!);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [imageProperties, setImageProperties] = useState({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		scale: 1,
	});

	const [isDragging, setIsDragging] = useState(false);
	const imageRef = useRef<HTMLImageElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");

		if (canvas && ctx) {
			const image = new Image();

			image.onload = () => {
				const { naturalWidth, naturalHeight } = image;

				const canvasWidth = canvas.width;
				const canvasHeight = canvas.height;

				const aspectRatio = naturalWidth / naturalHeight;
				let width = canvasWidth;
				let height = canvasWidth / aspectRatio;

				if (height < canvasHeight) {
					width = canvasHeight * aspectRatio;
					height = canvasHeight;
				}

				const x = (canvasWidth - width) / 2;
				const y = (canvasHeight - height) / 2;

				setImageProperties({
					x,
					y,
					width,
					height,
					scale: 1,
				});

				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				ctx.drawImage(image, x, y, width, height);
			};

			image.src = imageUrl;
			imageRef.current = image;
		}
	}, [imageUrl]);

	const handleMouseDown = useCallback(
		(
			e:
				| React.MouseEvent<HTMLCanvasElement, MouseEvent>
				| React.TouchEvent<HTMLCanvasElement>
		) => {
			e.preventDefault(); // Prevents default touch behavior

			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

			setIsDragging(true);
			setDragStart({ x: clientX, y: clientY });
		},
		[]
	);

	// if (isDragging) {
	// 	const offsetX = e.clientX - dragStart.x;
	// 	const offsetY = e.clientY - dragStart.y;
	// 	setImageProperties((prevProps) => ({
	// 		...prevProps,
	// 		x: prevProps.x + offsetX,
	// 		y: prevProps.y + offsetY,
	// 	}));
	// 	setDragStart({ x: e.clientX, y: e.clientY });
	// 	const canvas = canvasRef.current;
	// 	const ctx = canvas?.getContext("2d");
	// 	if (canvas && ctx) {
	// 		const { x, y, width, height } = imageProperties;
	// 		ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 		ctx.drawImage(imageRef.current!, x, y, width, height);
	// 	}
	// }

	const handleMouseMove = useCallback(
		(
			e:
				| React.MouseEvent<HTMLCanvasElement>
				| React.TouchEvent<HTMLCanvasElement>
		) => {
			if (isDragging) {
				const offsetX =
					"touches" in e
						? e.touches[0].clientX - dragStart.x
						: e.clientX - dragStart.x;
				const offsetY =
					"touches" in e
						? e.touches[0].clientY - dragStart.y
						: e.clientY - dragStart.y;

				const canvas = canvasRef.current;
				const ctx = canvas?.getContext("2d");

				if (canvas && ctx) {
					const canvasWidth = canvas.width;
					const canvasHeight = canvas.height;

					const { x, y, width, height } = imageProperties;
					const imageRight = x + width;
					const imageBottom = y + height;

					// Calculate the new image position while applying constraints
					let newX = x + offsetX;
					let newY = y + offsetY;

					if (newX > 0) newX = 0;
					if (newY > 0) newY = 0;
					if (imageRight < canvasWidth) newX = canvasWidth - width;
					if (imageBottom < canvasHeight) newY = canvasHeight - height;

					setImageProperties((prevProps) => ({
						...prevProps,
						x: newX,
						y: newY,
					}));

					setDragStart({
						x: "touches" in e ? e.touches[0].clientX : e.clientX,
						y: "touches" in e ? e.touches[0].clientY : e.clientY,
					});

					ctx.clearRect(0, 0, canvasWidth, canvasHeight);
					ctx.drawImage(imageRef.current!, newX, newY, width, height);
				}
			}
		},
		[isDragging, dragStart, imageProperties]
	);

	const handleMoueUp = () => {
		setIsDragging(false);
	};
	const handleMouseLeave = () => {
		setIsDragging(false);
	};

	const convertCanvasToImage = (): HTMLImageElement => {
		const canvas = canvasRef.current;
		const image = new Image();
		if (canvas) {
			image.src = canvas.toDataURL("image/webp");
		}
		return image;
	};

	return (
		<div className="flex items-center flex-col p-3 md:bg-zinc-900 md:rounded-xl md:px-4 md:my-4">
			<h3 className="my-2 font-bold flex">
				Crop Your Image
				<PencilSquareIcon width={20} className="inline-block ml-2" />
			</h3>
			<div className="relative flex justify-center">
				<canvas
					ref={canvasRef}
					width={500}
					height={500}
					className="bg-black relative cursor-move rounded border-[1px] border-gray-900 shadow-2xl w-2/3 md:w-full"
					onMouseDown={handleMouseDown}
					onTouchStart={handleMouseDown}
					onMouseMove={handleMouseMove}
					onTouchMove={handleMouseMove}
					onMouseUp={handleMoueUp}
					onTouchEnd={handleMoueUp}
					onMouseLeave={handleMouseLeave}
				></canvas>
				<Grid isDragging={isDragging} />
			</div>

			<button
				onClick={() => {
					onSave(convertCanvasToImage());
				}}
				className=" bg-gradient-to-r from-pink-700 to-violet-600 rounded px-3 py-1 my-4 md:w-full transition-transform duration-100 hover:scale-105"
			>
				Save
			</button>
		</div>
	);
};

const Grid = ({ isDragging }: { isDragging: boolean }) => {
	return (
		<div
			className={` ${
				isDragging ? "opacity-60" : "opacity-0"
			} md:grid  transition-all duration-300 absolute top-0 left-0 w-full h-full grid-cols-3 hidden grid-rows-3 pointer-events-none`}
		>
			{Array.from({ length: 9 }).map((_, index) => (
				<div
					key={index}
					className={`${(index + 1) % 3 !== 0 ? "border-r-[1px] " : ""}${
						index < 6 ? "border-b-[1px] " : ""
					}border-gray-100`}
				></div>
			))}
		</div>
	);
};

export default EditorCanvas;
