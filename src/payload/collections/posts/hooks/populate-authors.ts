import type { User } from "@/payload-types";
import type { CollectionAfterReadHook } from "payload";

/**
 * manually fetches and populates essential author details into a non-relationship field
 * after a document is read. this pattern ensures that minimal author information (id and name)
 * is readily available without deep-populating the entire 'users' collection, which often has
 * restricted read access.
 */
const populateAuthors: CollectionAfterReadHook = async ({ doc, req: { payload } }) => {
	// proceed only if the document has a non-empty 'authors' relationship field.
	if (doc?.authors && doc?.authors?.length > 0) {
		const authorDocs: User[] = [];

		// iterate over each author reference in the array.
		for (const author of doc.authors) {
			try {
				// fetch the full user document by id, keeping depth at 0 to avoid circular dependencies and over-fetching.
				const authorDoc = await payload.findByID({
					id: typeof author === "object" ? author?.id : author,
					collection: "users",
					depth: 0,
				});

				// if the document is successfully retrieved, add it to the temporary list.
				if (authorDoc) {
					authorDocs.push(authorDoc);
				}

				// map the fetched user documents to the minimal structure required for the cache field.
				if (authorDocs.length > 0) {
					doc.populatedAuthors = authorDocs.map((authorDoc) => ({
						id: authorDoc.id,
						name: authorDoc.name,
					}));
				}
			} catch {
				// intentionally ignore errors during individual author fetches,
				// allowing the post to still load even if one author is missing or inaccessible.
			}
		}
	}

	// return the modified document.
	return doc;
};

// export the hook for use in the collection configuration.
export { populateAuthors };
