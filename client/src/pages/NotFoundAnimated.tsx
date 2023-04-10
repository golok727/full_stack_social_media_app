import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
	return (
		<motion.div
			className="flex items-center justify-center min-h-screen bg-black absolute inset-0"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			<motion.div
				className="max-w-2xl text-center"
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
			>
				<h1 className="text-6xl font-bold text-white mb-8">404 Not Found</h1>
				<p className="text-2xl text-gray-300 mb-8">
					The page you are looking for does not exist.
				</p>
				<Link
					to="/"
					className="inline-block bg-gray-700 hover:bg-gray-800 text-white text-xl font-semibold py-4 px-8 rounded-full transition-all duration-300 ease-in-out absolute bottom-8 left-1/2 transform -translate-x-1/2"
				>
					Go to Home
				</Link>
			</motion.div>
		</motion.div>
	);
};

export default NotFound;
