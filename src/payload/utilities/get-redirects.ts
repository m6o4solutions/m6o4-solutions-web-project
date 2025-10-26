import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

/**
 * fetches all redirects from the Payload CMS 'redirects' collection.
 *
 * @param {number} [depth=1] - the depth for document population.
 * @returns {Promise<Array<Object>>} a promise that resolves to an array of redirect documents.
 */
const getRedirects = async (depth = 1) => {
	const payload = await getPayload({ config: config });

	const { docs: redirects } = await payload.find({
		collection: "redirects",
		depth,
		limit: 0,
		pagination: false,
	});

	return redirects;
};

/**
 * returns an unstable_cache function mapped with the cache tag for 'redirects'.
 *
 * cache all redirects together to avoid multiple fetches.
 * @returns {Function} a cached version of the getRedirects function.
 */
const getCachedRedirects = () =>
	unstable_cache(async () => getRedirects(), ["redirects"], {
		tags: ["redirects"],
	});

export { getRedirects, getCachedRedirects };
