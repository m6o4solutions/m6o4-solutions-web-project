import type { Page } from "@/payload-types";
import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

/* revalidates pages that reference a testimonial when that testimonial updates */
const revalidateTestimonyChange: CollectionAfterChangeHook = async ({
	doc,
	req: { payload, context },
}) => {
	// skip during controlled operations
	if (context?.disableRevalidate) return doc;

	if (!doc?.id) return doc;

	try {
		// find pages that reference this testimonial inside layout blocks
		const result = await payload.find({
			collection: "pages",
			where: {
				"layout.testimonials": {
					contains: doc.id,
				},
			},
			depth: 0,
			limit: 1000,
		});

		const pages = (result?.docs ?? []) as Page[];

		if (pages.length) {
			payload.logger.info(
				`revalidating ${pages.length} page(s) referencing testimonial ${doc.id}...`,
			);

			pages.forEach((page) => {
				const path = page?.slug === "home" ? "/" : `/${page?.slug}`;

				try {
					revalidatePath(path);
					payload.logger.info(`revalidated ${path}`);
				} catch (err) {
					payload.logger.error(`failed to revalidate ${path}: ${(err as Error).message}`);
				}
			});
		} else {
			payload.logger.info(
				`no pages found referencing testimonial ${doc.id}. revalidating pages-sitemap tag as fallback.`,
			);
		}

		// always update sitemap tag so aggregated listings refresh
		revalidateTag("pages-sitemap", "max");
	} catch (err) {
		payload.logger.error(
			`testimonial revalidation error for ${doc.id}: ${(err as Error).message}`,
		);

		// still attempt sitemap refresh
		try {
			revalidateTag("pages-sitemap", "max");
		} catch {}
	}

	return doc;
};

/* revalidates pages that referenced a testimonial when it is deleted */
const revalidateTestimonyDelete: CollectionAfterDeleteHook = async ({
	doc,
	req: { payload, context },
}) => {
	if (context?.disableRevalidate) return doc;

	if (!doc?.id) {
		revalidateTag("pages-sitemap", "max");
		return doc;
	}

	try {
		const result = await payload.find({
			collection: "pages",
			where: {
				"layout.testimonials": {
					contains: doc.id,
				},
			},
			depth: 0,
			limit: 1000,
		});

		const pages = (result?.docs ?? []) as Page[];

		if (pages.length) {
			payload.logger.info(
				`revalidating ${pages.length} page(s) referencing deleted testimonial ${doc.id}...`,
			);

			pages.forEach((page) => {
				const path = page.slug === "home" ? "/" : `/${page.slug}`;

				try {
					revalidatePath(path);
					payload.logger.info(`revalidated ${path}`);
				} catch (err) {
					payload.logger.error(`failed to revalidate ${path}: ${(err as Error).message}`);
				}
			});
		} else {
			payload.logger.info(`no pages found referencing deleted testimonial ${doc.id}.`);
		}

		revalidateTag("pages-sitemap", "max");
	} catch (err) {
		payload.logger.error(
			`testimonial delete revalidation error for ${doc?.id}: ${(err as Error).message}`,
		);

		try {
			revalidateTag("pages-sitemap", "max");
		} catch {}
	}

	return doc;
};

export { revalidateTestimonyChange, revalidateTestimonyDelete };
