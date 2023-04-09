const Loading = () => {
	return (
		<div className="absolute inset-0 bg-black text-white font-bold flex justify-center items-center text-3xl">
			<span className="animate-pulse delay-74">Loading</span>
			<span className="animate-pulse delay-100">.</span>
			<span className="delay-300 animate-bounce">.</span>
			<span className="animate-pulse delay-1000">.</span>
			<span className="delay-300 animate-bounce">.</span>
		</div>
	);
};

export default Loading;
