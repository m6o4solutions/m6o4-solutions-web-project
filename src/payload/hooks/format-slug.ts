import type { FieldHook } from "payload";

/* 
formats a string into a url-friendly slug
converts to lowercase, replaces spaces with hyphens, and removes special characters
*/
const format = (val: string): string =>
	val
		.replace(/ /g, "-")
		.replace(/[^\w-]+/g, "")
		.toLowerCase();

/* 
returns a payload field hook that auto-generates a slug
if a manual value is provided, it formats and returns it
if creating a new document, it uses a fallback field (e.g., title) when no slug is provided
otherwise, it preserves the existing value
*/
const formatSlug =
	(fallback: string): FieldHook =>
	({ data, operation, originalDoc, value }) => {
		if (typeof value === "string") {
			return format(value);
		}

		if (operation === "create") {
			const fallbackData = data?.[fallback] || originalDoc?.[fallback];
			if (fallbackData && typeof fallbackData === "string") {
				return format(fallbackData);
			}
		}

		return value;
	};

export { formatSlug };
