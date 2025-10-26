import type { Config, Media, Page, Post } from "@/payload-types";
import { getServerSideURL } from "@/payload/utilities/get-url";
import { mergeOpenGraph } from "@/payload/utilities/merge-opengraph";
import type { Metadata } from "next";

/**
 * determines the absolute url for the open graph image.
 * Uses the doc's meta image if available, otherwise falls back to a default template OG image.
 * @param {Media | Config['db']['defaultIDType'] | null} image - The media object or ID from the document's meta field.
 * @returns {string} the absolute URL of the OG image.
 */
const getImageURL = (image?: Media | Config["db"]["defaultIDType"] | null) => {
	const serverUrl = getServerSideURL();

	let url = serverUrl + "/website-template-OG.webp";

	if (image && typeof image === "object" && "url" in image) {
		const ogUrl = image.sizes?.og?.url;

		url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url;
	}

	return url;
};

/**
 * generates the next.js metadata object (title, description, and opengraph data)
 * for a Payload document (page or post).
 * @param {object} args - the arguments containing the document.
 * @param {Partial<Page> | Partial<Post> | null} args.doc - the payload document.
 * @returns {Promise<Metadata>} the generated next.js metadata.
 */
const generateMeta = async (args: { doc: Partial<Page> | Partial<Post> | null }): Promise<Metadata> => {
	const { doc } = args;

	const ogImage = getImageURL(doc?.meta?.image);

	const title = doc?.meta?.title ? doc?.meta?.title + " | M6O4 Solutions" : "M6O4 Solutions";

	return {
		description: doc?.meta?.description,
		openGraph: mergeOpenGraph({
			description: doc?.meta?.description || "",
			images: ogImage
				? [
						{
							url: ogImage,
						},
					]
				: undefined,
			title,
			// fallback slug logic
			url: Array.isArray(doc?.slug) ? doc?.slug.join("/") : "/",
		}),
		title,
	};
};

export { getImageURL, generateMeta };
