import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface EditorCanvasProps {
	imageUrl: string;
}
const EditorCanvas = ({ imageUrl }: EditorCanvasProps) => {
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

	// Handlers

	const handleMoveDown = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
			setIsDragging(true);
			setDragStart({ x: e.clientX, y: e.clientY });
		},
		[]
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
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

			if (isDragging) {
				const offsetX = e.clientX - dragStart.x;
				const offsetY = e.clientY - dragStart.y;

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

					setDragStart({ x: e.clientX, y: e.clientY });

					ctx.clearRect(0, 0, canvasWidth, canvasHeight);
					ctx.drawImage(imageRef.current!, newX, newY, width, height);
				}
			}
		},
		[isDragging, dragStart, imageProperties]
	);
	const handleMoveUp = () => {
		setIsDragging(false);
	};
	const handleMouseLeave = () => {
		setIsDragging(false);
	};
	const handleWheel = (e: WheelEvent) => {
		e.preventDefault();
	};

	useEffect(() => {
		document.addEventListener("wheel", handleWheel);

		return () => {
			document.removeEventListener("wheel", handleWheel);
		};
	}, []);

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={500}
				height={500}
				className="bg-black cursor-move rounded border-[1px] border-gray-900 shadow-2xl"
				onMouseDown={handleMoveDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMoveUp}
				onMouseLeave={handleMouseLeave}
			></canvas>
			<button className="block bg-gradient-to-r from-pink-700 to-violet-600 rounded px-3 py-1 my-4">
				Save
			</button>
		</div>
	);
};

export default EditorCanvas;
