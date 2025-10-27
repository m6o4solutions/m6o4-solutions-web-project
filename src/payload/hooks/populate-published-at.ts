import type { CollectionBeforeChangeHook } from "payload";

/* 
runs before a document is created or updated
automatically sets 'publishedAt' to the current date if not provided in the request data
ensures consistent publish timestamps across all content operations
*/
const populatePublishedAt: CollectionBeforeChangeHook = ({ data, operation, req }) => {
	if ((operation === "create" || operation === "update") && req.data && !req.data.publishedAt) {
		return {
			...data,
			publishedAt: new Date(),
		};
	}

	return data;
};

export { populatePublishedAt };
