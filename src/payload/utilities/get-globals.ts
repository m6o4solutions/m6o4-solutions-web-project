import type { Config } from "@/payload-types";
import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

type Global = keyof Config["globals"];

// each slug directly maps to its corresponding global type
type DataFromGlobalSlug<TSlug extends Global> = Config["globals"][TSlug];

/**
 * fetches a single global document from Payload by slug.
 * @param {Global} slug - the slug of the global document.
 * @param {number} [depth=0] - the depth for relationship population.
 * @returns {Promise<any>} the global document object.
 */
const getGlobal = async <TSlug extends Global>(slug: TSlug, depth = 0): Promise<DataFromGlobalSlug<TSlug>> => {
	const payload = await getPayload({ config });

	const global = await payload.findGlobal({
		slug,
		depth,
	});

	// cast safely to the inferred type
	return global as DataFromGlobalSlug<TSlug>;
};

/**
 * returns an unstable_cache function mapped with a cache tag for the global's slug.
 * the returned function should be called to execute the query, e.g., `await getCachedGlobal('header')()`.
 * @param {Global} slug - the slug of the global.
 * @param {number} [depth=0] - the depth for relationship population.
 * @returns {() => Promise<any>} a memoized function that returns the global document.
 */
const getCachedGlobal = <TSlug extends Global>(slug: TSlug, depth = 0) =>
	unstable_cache(async () => getGlobal(slug, depth), [slug], {
		tags: [`global_${slug}`],
	});

export { getGlobal, getCachedGlobal };
