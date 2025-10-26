import type { Config } from "@/payload-types";
import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

type Collection = keyof Config["collections"];

/**
 * fetches a single document from payload by slug.
 * @param {Collection} collection - the collection slug.
 * @param {string} slug - the slug of the document.
 * @param {number} [depth=0] - the depth for relationship population.
 * @returns {Promise<any>} the document object.
 */
const getDocument = async (collection: Collection, slug: string, depth = 0) => {
	const payload = await getPayload({ config: config });

	const page = await payload.find({
		collection,
		depth,
		where: {
			slug: {
				equals: slug,
			},
		},
	});

	return page.docs[0];
};

/**
 * returns an unstable_cache function mapped with a cache tag for the document's slug.
 * the returned function should be called to execute the query, e.g., `await getCachedDocument('pages', 'home')()`.
 * @param {Collection} collection - the collection slug.
 * @param {string} slug - the slug of the document.
 * @returns {() => Promise<any>} a memoized function that returns the document.
 */
const getCachedDocument = (collection: Collection, slug: string) =>
	unstable_cache(async () => getDocument(collection, slug), [collection, slug], {
		tags: [`${collection}_${slug}`],
	});

export { getDocument, getCachedDocument };
