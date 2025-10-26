import { getServerSideURL } from "@/payload/utilities/get-url";
import type { Metadata } from "next";

const defaultOpenGraph: Metadata["openGraph"] = {
	type: "website",
	description: "M6O4 delivers trusted, modern technology solutions that help businesses grow with confidence.",
	images: [
		{
			url: `${getServerSideURL()}/abstract-image-1.jpg`,
		},
	],
	siteName: "M6O4 Solutions",
	title: "M6O4 Solutions",
};

/**
 * merges provided open graph metadata with a set of sensible defaults.
 * this is designed to ensure required open graph fields are always present.
 * the 'images' array is handled specially to prevent simple spread-overwriting if an image is provided.
 * @param {Metadata['openGraph']} [og] - optional open graph metadata to merge.
 * @returns {Metadata['openGraph']} the merged open graph metadata object.
 */
const mergeOpenGraph = (og?: Metadata["openGraph"]): Metadata["openGraph"] => {
	return {
		...defaultOpenGraph,
		...og,
		// explicitly handle images to ensure it's not overwritten by a simple spread if an image is provided
		images: og?.images ? og.images : defaultOpenGraph.images,
	};
};

export { mergeOpenGraph };
