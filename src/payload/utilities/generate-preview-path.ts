import type { CollectionSlug, PayloadRequest } from "payload";

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
	posts: "/posts",
	pages: "",
};

type Props = {
	collection: keyof typeof collectionPrefixMap;
	slug: string;
	req: PayloadRequest;
};

/**
 * generates the url path for next.js Draft Mode (Preview Mode) based on a Payload document's collection and slug.
 * @param {Props} args - the arguments including collection, slug, and Payload request object.
 * @returns {string} the full preview URL path.
 */
const generatePreviewPath = ({ collection, slug }: Props) => {
	const path = collectionPrefixMap[collection];

	const encodedParams = new URLSearchParams({
		slug,
		collection,
		path: `${path}/${slug}`,
		previewSecret: process.env.PREVIEW_SECRET!,
	});

	const url = `/next/preview?${encodedParams.toString()}`;

	return url;
};

export { generatePreviewPath };
