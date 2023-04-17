export const numberFormatter = (n: number): string => {
	const formatter = new Intl.NumberFormat("en", { notation: "compact" });
	return formatter.format(n);
};

export const formatDate = (str: Date | string): string => {
	const formatter = new Intl.DateTimeFormat("en", {
		month: "long",
		day: "2-digit",
	});

	return formatter.format(new Date(str)).toUpperCase();
};
