import { revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

/**
 * a payload hook that runs after the 'footer' global document is changed.
 * it invalidates the next.js cache tag associated with the footer data
 * to ensure the frontend displays the latest links and information immediately.
 */
export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
	// only proceed with cache revalidation if the context flag is not set to disable it.
	if (!context.disableRevalidate) {
		// log the action for monitoring.
		payload.logger.info(`revalidating footer...`);

		// invalidate the next.js cache for the specific tag used when fetching footer data.
		// revalidateTag now expects a profile (string | CacheLifeConfig) as the first argument
		// and the tag name as the second argument.
		revalidateTag("global_footer", "max");
	}

	// return the document data, as required by the hook signature.
	return doc;
};
