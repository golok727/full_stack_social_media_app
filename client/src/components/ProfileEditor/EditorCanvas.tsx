import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface EditorCanvasProps {
	imageUrl: string;
}
const EditorCanvas = ({ imageUrl }: EditorCanvasProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null!);
	const [imageProperties, setImageProperties] = useState({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});

	const [isDragging, setIsDragging] = useState(false);
	const image = useMemo(() => {
		const im = new Image();
		im.src = imageUrl;
		im.addEventListener("load", () => {});
		return im;
	}, [imageUrl]);

	const handleMoveStart = () => {
		console.log("start");

		setIsDragging(true);
	};

	const setPos = useCallback(() => {
		if (canvasRef.current) {
			const { current: canvasElem } = canvasRef;
			const ctx = canvasElem.getContext("2d") as CanvasRenderingContext2D;
			ctx.clearRect(
				canvasElem.width / 2,
				canvasElem.height / 2,
				canvasElem.width,
				canvasElem.height
			);

			ctx.drawImage(
				image,
				imageProperties.x,
				imageProperties.y,
				image.width,
				image.height
			);
		}
	}, [imageProperties]);

	const handleMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		if (isDragging) {
			console.log("move");
			if (canvasRef.current) {
				if (!image) return;

				const { current: canvasElem } = canvasRef;
				const ctx = canvasElem.getContext("2d") as CanvasRenderingContext2D;

				const canvasWidth = canvasElem.width;
				const canvasHeight = canvasElem.height;
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				// console.log({
				// 	x: e.clientX - canvasElem.offsetLeft,
				// 	y: e.clientY - canvasElem.offsetTop,
				// });
				const currentX = e.clientX - canvasElem.offsetLeft;
				const currentY = e.clientY - canvasElem.offsetTop;
				const deltaX = currentX - imageProperties.x;
				const deltaY = currentY - imageProperties.y;

				console.log({ x: currentX + deltaX, y: currentY + deltaY });

				setImageProperties((prev) => ({
					...prev,
					x: currentX + deltaX,
					y: currentY + deltaY,
				}));
				// console.log({ cx: e.clientX, cy: e.clientY });
				setPos();
			}
		}
	};

	const handleMouseLeave = () => {
		setIsDragging(false);
		setPos();
	};

	const handleMoveEnd = () => {
		setIsDragging(false);

		setPos();
	};

	useEffect(() => {
		if (canvasRef.current) {
			if (!image) return;

			const { current: canvasElem } = canvasRef;
			const ctx = canvasElem.getContext("2d") as CanvasRenderingContext2D;

			image.onload = () => {
				setImageProperties((prev) => ({
					...prev,
					width: image.width,
					height: image.height,
					x: 0,
					y: 0,
				}));
				ctx.drawImage(image, 0, 0, image.width, image.height);
			};
			// ctx.fill();
		}

		return () => {
			setImageProperties(() => ({ x: 0, y: 0, height: 0, width: 0 }));
		};
	}, [imageUrl]);

	useEffect(() => {
		const handleWheel = (e: WheelEvent) => {
			console.log(e.deltaX);
		};
		document.addEventListener("wheel", handleWheel);

		return () => {
			document.removeEventListener("wheel", handleWheel);
		};
	});

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={500}
				height={500}
				className="bg-black cursor-move"
				onMouseDown={handleMoveStart}
				onMouseMove={handleMove}
				onMouseUp={handleMoveEnd}
				onMouseLeave={handleMouseLeave}
			></canvas>
			<button className="block bg-gradient-to-r from-pink-700 to-violet-600 rounded px-3 py-1 my-4">
				Save
			</button>
		</div>
	);
};

export default EditorCanvas;
