import type { Page } from "@/payload-types";
import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

/**
 * revalidates the next.js cache for a specific page and the page sitemap tag.
 * this hook runs after a 'page' document is created or updated.
 */
const revalidatePage: CollectionAfterChangeHook<Page> = ({ doc, previousDoc, req: { payload, context } }) => {
	// skip revalidation if the context explicitly disables it (e.g., during a seeding process).
	if (!context.disableRevalidate) {
		// if the document's new status is 'published', trigger revalidation.
		if (doc._status === "published") {
			// determine the url path, treating the page with slug 'home' as the root '/'.
			const path = doc.slug === "home" ? "/" : `/${doc.slug}`;

			// log the revalidation action.
			payload.logger.info(`revalidating page at ${path}...`);

			// clear the next.js cache for the page's dynamic path.
			revalidatePath(path);
			// clear the next.js cache for the sitemap to include the new/updated page.
			revalidateTag("pages-sitemap", "max");
		}

		// if the page was previously published but is now unpublished (e.g., set to 'draft'),
		// revalidate the old path to ensure it's removed from the public cache.
		if (previousDoc?._status === "published" && doc._status !== "published") {
			// determine the old url path, treating the page with slug 'home' as the root '/'.
			const oldPath = previousDoc.slug === "home" ? "/" : `/${previousDoc.slug}`;

			// log the revalidation action.
			payload.logger.info(`revalidating old page at ${oldPath}...`);

			// clear the next.js cache for the page's former path.
			revalidatePath(oldPath);
			// clear the next.js cache for the sitemap to reflect the page's change in status.
			revalidateTag("pages-sitemap", "max");
		}
	}
	// return the document data, as required by the hook signature.
	return doc;
};

/**
 * revalidates the next.js cache for a deleted page and the page sitemap tag.
 * this hook runs after a 'page' document is deleted.
 */
const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
	// skip revalidation if the context explicitly disables it.
	if (!context.disableRevalidate) {
		// construct the path of the deleted page, treating the page with slug 'home' as the root '/'.
		const path = doc?.slug === "home" ? "/" : `/${doc?.slug}`;

		// clear the next.js cache for the deleted path to ensure a 404 on the frontend.
		revalidatePath(path);
		// clear the next.js cache for the sitemap to remove the deleted page.
		revalidateTag("pages-sitemap", "max");
	}

	// return the document data, as required by the hook signature.
	return doc;
};

// export both hooks for use in the payload configuration.
export { revalidatePage, revalidateDelete };
