import type { Post } from "@/payload-types";
import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

/**
 * revalidates the next.js cache for a specific blog post and the post sitemap tag.
 * this hook runs after a 'post' document is created or updated.
 */
const revalidatePost: CollectionAfterChangeHook<Post> = ({ doc, previousDoc, req: { payload, context } }) => {
	// only proceed with revalidation if the context flag is not set to disable it.
	if (!context.disableRevalidate) {
		// if the document's new status is 'published', trigger revalidation for the new/updated url.
		if (doc._status === "published") {
			const path = `/posts/${doc.slug}`;

			// log the revalidation action.
			payload.logger.info(`revalidating post at ${path}...`);

			// clear the next.js cache for the post's dynamic path.
			revalidatePath(path);
			// clear the next.js cache for the sitemap to include the new/updated post.
			revalidateTag("default", "max");
			revalidateTag("posts-sitemap", "max");
		}

		// if the post was previously published but is no longer published (e.g., set to 'draft'),
		// revalidate the old, now stale, path to ensure it's removed from the public cache.
		if (previousDoc._status === "published" && doc._status !== "published") {
			const oldPath = `/posts/${previousDoc.slug}`;

			// log the revalidation action.
			payload.logger.info(`revalidating old post at ${oldPath}...`);

			// clear the next.js cache for the post's former path.
			revalidatePath(oldPath);
			// clear the next.js cache for the sitemap to reflect the post's removal.
			revalidateTag("default", "max");
			revalidateTag("posts-sitemap", "max");
		}
	}
	// return the document data, as required by the hook signature.
	return doc;
};

/**
 * revalidates the next.js cache for a deleted blog post and the post sitemap tag.
 * this hook runs after a 'post' document is deleted.
 */
const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
	// only proceed with revalidation if the context flag is not set to disable it.
	if (!context.disableRevalidate) {
		// construct the path of the deleted post.
		const path = `/posts/${doc?.slug}`;

		// clear the next.js cache for the deleted path to ensure a 404 on the frontend.
		revalidatePath(path);
		// clear the next.js cache for the sitemap to remove the deleted post.
		revalidateTag("default", "posts-sitemap");
	}

	// return the document data, as required by the hook signature.
	return doc;
};

// export both hooks for use in the payload configuration.
export { revalidatePost, revalidateDelete };
