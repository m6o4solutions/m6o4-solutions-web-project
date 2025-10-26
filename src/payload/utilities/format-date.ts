/**
 * @function formatdate
 * @description formats a date string into a human-readable string. it displays
 * relative time (e.g., "5 minutes ago", "3 days ago") for recent dates,
 * and a full localized date (e.g., "january 15, 2025") for older dates.
 *
 * @param {string | null | undefined} datestring - the date string to be formatted.
 * @returns {string} the formatted date string, or an error message if the input is invalid.
 */
const formatDate = (dateString?: string | null): string => {
	// handle null, undefined, or empty date string input
	if (!dateString) return "Unknown date";

	// create a date object from the string
	const date = new Date(dateString);

	// check if the date object is invalid (e.g., failed to parse)
	if (isNaN(date.getTime())) return "Invalid date";

	// get the current time for comparison
	const now = new Date();

	// calculate the difference in milliseconds
	const diffMs = now.getTime() - date.getTime();

	// calculate the difference in full days
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	// --- relative time logic ---

	// check if the difference is less than one full day (today)
	if (diffDays < 1) {
		// calculate difference in hours
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

		// if less than an hour ago
		if (diffHours < 1) {
			// calculate difference in minutes
			const diffMinutes = Math.floor(diffMs / (1000 * 60));
			// return "just now" or "x minutes ago"
			return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
		}

		// return "x hours ago"
		return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
	}

	// if within the last 7 days (but more than 1 day ago)
	if (diffDays < 7) {
		// return "x days ago"
		return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
	}

	// --- full date formatting (for older dates) ---

	// otherwise, show the full, long-form date
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export { formatDate };
