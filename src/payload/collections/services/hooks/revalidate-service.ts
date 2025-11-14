import type { Service } from "@/payload-types";
import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

/**
 * revalidates the next.js cache for a specific service page and the services sitemap tag.
 * this hook runs after a 'service' document is created or updated.
 * since access is public (isPublic), any change triggers a revalidation.
 */
const revalidateService: CollectionAfterChangeHook<Service> = ({ doc, req: { payload, context } }) => {
	// skip revalidation if the context explicitly disables it (e.g., during a seeding process).
	if (!context.disableRevalidate) {
		// determine the url path using the slug, prepending '/services/'.
		const path = `/services/${doc.slug}`;

		// log the revalidation action.
		payload.logger.info(`revalidating service page at ${path}...`);

		// clear the next.js cache for the service's dynamic path.
		revalidatePath(path);
		// clear the next.js cache for the services sitemap to reflect the update.
		revalidateTag("services-sitemap", "max");
	}

	// return the document data, as required by the hook signature.
	return doc;
};

/**
 * revalidates the next.js cache for a deleted service page and the services sitemap tag.
 * this hook runs after a 'service' document is deleted.
 */
const revalidateDeleteService: CollectionAfterDeleteHook<Service> = ({ doc, req: { context } }) => {
	// skip revalidation if the context explicitly disables it.
	if (!context.disableRevalidate) {
		// construct the path of the deleted service.
		const path = `/services/${doc?.slug}`;

		// log the revalidation action.
		// note: logging is often removed in final production code but kept here for consistency.
		// payload.logger.info(`revalidating deleted service page at ${path}...`);

		// clear the next.js cache for the deleted path to ensure a 404 on the frontend.
		revalidatePath(path);
		// clear the next.js cache for the sitemap to remove the deleted service.
		revalidateTag("services-sitemap", "max");
	}

	// return the document data, as required by the hook signature.
	return doc;
};

// export both hooks for use in the payload configuration.
export { revalidateService, revalidateDeleteService };
