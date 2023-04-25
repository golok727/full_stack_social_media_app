// Create a closure around the number formatter
export const numberFormatter = (() => {
	const formatter = new Intl.NumberFormat("en", { notation: "compact" });
	return (n: number) => formatter.format(n);
})();

export const formatDate = (() => {
	const formatter = new Intl.DateTimeFormat("en", {
		month: "long",
		day: "2-digit",
	});
	return (str: Date | string) => {
		const inputDate = new Date(str);
		const currentDate = new Date();
		const diffTime = Math.abs(currentDate.getTime() - inputDate.getTime());
		const diffSeconds = Math.floor(diffTime / 1000);
		const diffMinutes = Math.floor(diffTime / (1000 * 60));
		const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const diffMonths = Math.floor(diffDays / 30);
		const diffYears = Math.floor(diffDays / 365);
		let diff;
		if (diffSeconds < 60) {
			diff = `${diffSeconds}s`;
		} else if (diffMinutes < 60) {
			diff = `${diffMinutes}m`;
		} else if (diffHours < 24) {
			diff = `${diffHours}h`;
		} else if (diffDays < 30) {
			diff = `${diffDays}day${diffDays === 1 ? "" : "s"}`;
		} else if (diffMonths < 12) {
			diff = `${diffMonths} month${diffMonths === 1 ? "" : "s"}`;
		} else {
			diff = `${diffYears} year${diffYears === 1 ? "" : "s"}`;
		}
		return `${diff}`;
	};
})();
