import { revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

/**
 * a payload hook that runs after the 'header' global document is changed.
 * it invalidates the next.js cache tag associated with the header data
 * to ensure the frontend displays the latest navigation and branding immediately.
 */
const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
	// only proceed with cache revalidation if the context flag is not set to disable it.
	if (!context.disableRevalidate) {
		// log the action for monitoring and debugging.
		payload.logger.info(`revalidating header...`);

		// invalidate the next.js cache for the specific tag used when fetching header data.
		revalidateTag("global_header", "max");
	}

	// return the document data, as required by the hook signature.
	return doc;
};

// export the hook for use in the 'header' global configuration.
export { revalidateHeader };
