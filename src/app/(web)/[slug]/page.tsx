import { LivePreviewListener } from "@/components/live-preview-listener";
import { PayloadRedirects } from "@/components/payload-redirects";
import { RenderBlocks } from "@/payload/blocks/render-blocks";
import { generateMeta } from "@/payload/utilities/generate-meta";
import config from "@payload-config";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import React, { cache } from "react";

/**
 * generates the static path segments for all published pages in the 'pages' collection,
 * excluding the 'home' page. this is used by next.js for static site generation (SSG).
 * @returns {Promise<Array<{ slug: string }>>} an array of static parameter objects.
 */
const generateStaticParams = async () => {
	const payload = await getPayload({ config: config });

	const pages = await payload.find({
		collection: "pages",
		draft: false,
		limit: 1000,
		overrideAccess: false,
		pagination: false,
		select: {
			slug: true,
		},
	});

	const params = pages.docs
		// filter out the 'home' slug since it's typically handled by the root route
		?.filter((doc) => {
			return doc.slug !== "home";
		})
		// map the remaining documents to the required { slug } object structure
		.map(({ slug }) => {
			return { slug };
		});

	// if params is undefined (e.g., if pages.docs was null), return an empty array
	return params || [];
};

type Args = { params: Promise<{ slug?: string }> };

/**
 * next.js page component responsible for fetching and rendering page content based on slug.
 * it also handles draft mode preview and redirects.
 */
const Page = async ({ params: paramsPromise }: Args) => {
	const { isEnabled: draft } = await draftMode();

	const { slug = "home" } = await paramsPromise;

	const url = "/" + slug;

	const page = await queryPageBySlug({
		slug,
	});

	if (!page) {
		return <PayloadRedirects url={url} />;
	}

	const { layout } = page;

	return (
		<article>
			{/* allows redirects for valid pages too */}
			<PayloadRedirects disableNotFound url={url} />

			{draft && <LivePreviewListener />}

			<RenderBlocks blocks={layout} />
		</article>
	);
};

/**
 * generates dynamic Next.js metadata (SEO) for a page based on its slug,
 * fetching data from the corresponding Payload document.
 */
const generateMetadata = async ({ params: paramsPromise }: Args): Promise<Metadata> => {
	const { slug = "home" } = await paramsPromise;

	const page = await queryPageBySlug({
		slug,
	});

	return generateMeta({ doc: page });
};

/**
 * fetches a single page document from payload based on its slug,
 * respecting the next.js draft mode status for fetching drafts or published content.
 * the result is cached using react's `cache`.
 * @param {object} args - the arguments.
 * @param {string} args.slug - the slug of the page.
 * @returns {Promise<any | null>} the page document or null if not found.
 */
const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
	const { isEnabled: draft } = await draftMode();

	const payload = await getPayload({ config: config });

	const result = await payload.find({
		collection: "pages",
		// fetch drafts if draft mode is enabled
		draft,
		limit: 1,
		pagination: false,
		// override access only in draft mode to ensure drafts are visible
		overrideAccess: draft,
		where: {
			slug: {
				equals: slug,
			},
		},
	});

	// return the first document found or null
	return result.docs?.[0] || null;
});

export { generateStaticParams, Page as default, generateMetadata };
