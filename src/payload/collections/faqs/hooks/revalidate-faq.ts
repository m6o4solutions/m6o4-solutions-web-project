import type { Page } from "@/payload-types";
import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

/**
 * when an faq item changes, find all pages that reference it (via layout blocks)
 * and revalidate their paths so the frontend shows updated faq content.
 */
const revalidateFaqChange: CollectionAfterChangeHook = async ({
	doc,
	req: { payload, context },
}) => {
	// skip revalidation during controlled operations like database seeding.
	if (context?.disableRevalidate) return doc;

	// safety check: only proceed if the document has a valid id.
	if (!doc?.id) return doc;

	try {
		// query the 'pages' collection to find any page whose layout blocks reference this faq id.
		const found = await payload.find({
			collection: "pages",
			where: {
				// use the 'contains' operator to check the layout's faqs relationship field.
				"layout.faqs": {
					contains: doc.id,
				},
			},
			// fetch full documents to extract the slug.
			depth: 0,
			limit: 1000,
		});

		const pages = (found?.docs ?? []) as Page[];

		if (pages.length) {
			payload.logger.info(
				`revalidating ${pages.length} page(s) referencing faq ${doc.id}...`,
			);
			pages.forEach((page) => {
				// construct the url path, mapping the 'home' slug to the root '/'.
				const path = page?.slug === "home" ? "/" : `/${page?.slug}`;
				try {
					// clear the next.js cache for the specific page path.
					revalidatePath(path);
					payload.logger.info(`revalidated ${path}`);
				} catch (err) {
					payload.logger.error(`failed to revalidate ${path}: ${(err as Error).message}`);
				}
			});
		} else {
			// log if no direct page references were found.
			payload.logger.info(
				`no pages found referencing faq ${doc.id}. revalidating pages-sitemap tag as fallback.`,
			);
		}

		// always refresh the sitemap tag as a best-effort, universal cache bust for any aggregations.
		revalidateTag("pages-sitemap", "max");
	} catch (err) {
		payload.logger.error(
			`error during faq revalidation for id ${doc.id}: ${(err as Error).message}`,
		);
		// attempt sitemap tag revalidation as a final fallback after an error.
		try {
			revalidateTag("pages-sitemap", "max");
		} catch {}
	}

	return doc;
};

/**
 * when an faq item is deleted, revalidate pages that referenced it to ensure the frontend doesn't show stale content.
 */
const revalidateFaqDelete: CollectionAfterDeleteHook = async ({
	doc,
	req: { payload, context },
}) => {
	// skip revalidation during controlled operations.
	if (context?.disableRevalidate) return doc;

	try {
		// if the deleted document lacked an id, still attempt to refresh the general sitemap tag.
		if (!doc?.id) {
			revalidateTag("pages-sitemap", "max");
			return doc;
		}

		// query the 'pages' collection using the id of the deleted faq item.
		const found = await payload.find({
			collection: "pages",
			where: {
				// target pages that contained a relationship to the faq item being deleted.
				"layout.faqs": {
					contains: doc.id,
				},
			},
			depth: 0,
			limit: 1000,
		});

		const pages = (found?.docs ?? []) as Page[];

		if (pages.length) {
			payload.logger.info(
				`revalidating ${pages.length} page(s) referencing deleted faq ${doc.id}...`,
			);
			pages.forEach((page) => {
				const path = page?.slug === "home" ? "/" : `/${page?.slug}`;
				try {
					// clear the cache for each page that previously used the deleted faq.
					revalidatePath(path);
					payload.logger.info(`revalidated ${path}`);
				} catch (err) {
					payload.logger.error(`failed to revalidate ${path}: ${(err as Error).message}`);
				}
			});
		} else {
			payload.logger.info(`no pages found referencing deleted faq ${doc.id}.`);
		}

		// ensures the sitemap tag is refreshed to update any aggregated listings.
		revalidateTag("pages-sitemap", "max");
	} catch (err) {
		payload.logger.error(
			`error during faq delete revalidation for id ${doc?.id}: ${(err as Error).message}`,
		);
		// final attempt to refresh the sitemap tag if an error occurred.
		try {
			revalidateTag("pages-sitemap", "max");
		} catch {}
	}

	return doc;
};

export { revalidateFaqChange, revalidateFaqDelete };
