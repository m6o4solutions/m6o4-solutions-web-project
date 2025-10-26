import { revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
	if (!context.disableRevalidate) {
		payload.logger.info(`Revalidating header...`);

		revalidateTag("global_header");
	}

	return doc;
};

export { revalidateHeader };
