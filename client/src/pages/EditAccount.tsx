import useAuth from "../hooks/useAuth";

const EditAccount = () => {
	const { auth } = useAuth();
	return (
		<div className="py-20 ">
			{auth.user &&
				Object.keys(auth.user).map((key, idx) => (
					<div className="text-white  flex flex-col gap-2">
						{(typeof (auth.user as any)[key] === "string" ||
							typeof (auth.user as any)[key] === "number") && (
							<>
								<label htmlFor="" className="">
									{key}
								</label>
								<input
									key={idx}
									type="text"
									className="w-56 bg-transparent border-[1px]"
									placeholder={key}
									name=""
									id=""
									value={(auth.user as any)[key]}
								/>
							</>
						)}

						{typeof (auth.user as any)[key] === "boolean" && (
							<>
								<label htmlFor="" className="">
									{key}
								</label>
								<input
									key={idx}
									type="checkbox"
									className="w-56 bg-transparent border-[1px]"
									name=""
									id=""
									checked={(auth.user as any)[key]}
								/>
							</>
						)}
					</div>
				))}
		</div>
	);
};

export default EditAccount;
