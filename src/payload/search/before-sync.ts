import type { BeforeSync, DocToSync } from "@payloadcms/plugin-search/types";

/**
 * custom 'beforeSync' hook for the search plugin.
 * this function modifies the document data before it's saved to the search index,
 * specifically to simplify SEO meta fields and manually populate category titles.
 */
const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
	const {
		doc: { relationTo: collection },
	} = searchDoc;

	const { slug, id, categories, title, meta } = originalDoc;

	// construct the base modified search document
	const modifiedDoc: DocToSync = {
		...searchDoc,
		slug,
		meta: {
			...meta,
			// fallback: Use doc title if meta title is missing
			title: meta?.title || title,
			// ensure image is stored as an id for search simplicity
			image: meta?.image?.id || meta?.image,
			description: meta?.description,
		},
		categories: [],
	};

	// manually populate categories to include title in the search document
	if (categories && Array.isArray(categories) && categories.length > 0) {
		const populatedCategories: { id: string | number; title: string }[] = [];

		for (const category of categories) {
			if (!category) {
				continue;
			}

			// if the category is already populated (an object), use it
			if (typeof category === "object" && "title" in category) {
				populatedCategories.push(category);
				continue;
			}

			// if the category is just an ID, manually fetch it
			const doc = await req.payload.findByID({
				collection: "categories",
				id: category as string | number, // cast to handle id type
				disableErrors: true,
				depth: 0,
				select: { title: true },
				req,
			});

			if (doc !== null) {
				populatedCategories.push(doc);
			} else {
				console.error(`Failed. Category not found when syncing collection '${collection}' with id '${id}' to search.`);
			}
		}

		// map the populated category objects to the search plugin's expected format
		modifiedDoc.categories = populatedCategories.map((each) => ({
			relationTo: "categories",
			categoryID: String(each.id),
			title: each.title,
		}));
	}

	return modifiedDoc;
};

export { beforeSyncWithSearch };
