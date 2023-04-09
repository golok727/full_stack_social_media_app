import React from "react";

const PostsPlaceHolder = () => {
	return (
		<div>
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
				<div key={i}>
					<div
						className="max-w-xs rounded-lg mb-6 bg-white shadow-lg dark:bg-neutral-700"
						aria-hidden="true"
					>
						{/* <img
							src="https://tecdn.b-cdn.net/img/new/standard/nature/182.webp"
							className="rounded-t-lg"
							alt="..."
						/> */}
						<div className="p-6">
							<h5 className="mb-2 animate-pulse text-xl font-medium text-neutral-900 dark:text-white">
								<span className="inline-block min-h-[1em] w-6/12 flex-auto cursor-wait bg-current align-middle opacity-50"></span>
							</h5>
							<p className="mb-4 animate-pulse text-base text-neutral-700 dark:text-white">
								<span className="inline-block min-h-[1em] w-7/12 flex-auto cursor-wait bg-current align-middle opacity-50"></span>
								<span className="inline-block min-h-[1em] w-4/12 flex-auto cursor-wait bg-current align-middle opacity-50"></span>
								<span className="inline-block min-h-[1em] w-4/12 flex-auto cursor-wait bg-current align-middle opacity-50"></span>
								<span className="inline-block min-h-[1em] w-6/12 flex-auto cursor-wait bg-current align-middle opacity-50"></span>
								<span className="inline-block min-h-[1em] w-8/12 flex-auto cursor-wait bg-current align-middle opacity-50"></span>
							</p>
							<a
								href="#"
								className="inline-block min-h-[1em] w-6/12 flex-auto cursor-wait rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white opacity-50 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out before:inline-block before:content-[''] hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
							></a>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default PostsPlaceHolder;
