import type { FieldHook } from "payload";

/* converts a string into a url-safe slug format */
const formatSlug = (val: string): string | undefined =>
	val
		?.replace(/ /g, "-") // replace spaces with hyphens
		.replace(/[^\w-]+/g, "") // remove non-word and special characters
		.toLowerCase(); // convert to lowercase

/* creates a payload field hook that generates or formats slugs automatically */
const formatSlugHook =
	(fallback: string): FieldHook =>
	({ data, operation, value }) => {
		/* if a manual value exists, format and return it */
		if (typeof value === "string") {
			return formatSlug(value);
		}

		/* if creating a new document or slug is undefined, use the fallback field value */
		if (operation === "create" || data?.slug === undefined) {
			const fallbackData = data?.[fallback];

			if (typeof fallbackData === "string") {
				return formatSlug(fallbackData);
			}
		}

		/* otherwise return the current value without modification */
		return value;
	};

export { formatSlug, formatSlugHook };
