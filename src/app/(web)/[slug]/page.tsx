import { LivePreviewListener } from "@/components/live-preview-listener";
import { PayloadRedirects } from "@/components/payload-redirects";
import { RenderBlocks } from "@/payload/blocks/render-blocks";
import { generateMeta } from "@/payload/utilities/generate-meta";
import config from "@payload-config";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import { cache } from "react";

/**
 * generates the static path segments for all published pages in the 'pages' collection.
 * this function is used by next.js for static site generation (ssg) to pre-build routes.
 * it excludes the 'home' page slug because it is handled by the root '/' route.
 *
 * @returns an array of objects in the format { slug: string }.
 */
const generateStaticParams = async () => {
	const payload = await getPayload({ config: config });

	// fetch all published pages.
	const pages = await payload.find({
		collection: "pages",
		draft: false, // only consider published pages for ssg.
		limit: 1000,
		overrideAccess: false,
		pagination: false,
		select: {
			slug: true,
		},
	});

	// filter out the 'home' slug and map the remaining documents to the required format.
	const params = pages.docs
		?.filter((doc) => {
			return doc.slug !== "home";
		})
		.map(({ slug }) => {
			return { slug };
		});

	// return the array of slugs for next.js ssg.
	return params || [];
};

type Args = { params: Promise<{ slug?: string }> };

/**
 * the next.js page component for dynamic page routes (e.g., /about-us).
 * it fetches page data by slug, handles redirects, and renders the content blocks.
 */
const Page = async ({ params: paramsPromise }: Args) => {
	// check if next.js draft mode is active.
	const { isEnabled: draft } = await draftMode();

	// safely get the slug from the url parameters, defaulting to 'home' if none is provided.
	const { slug = "home" } = await paramsPromise;

	// construct the full url path for use with the redirect component.
	const url = "/" + slug;

	// fetch the page data using the cached function.
	const page = await queryPageBySlug({
		slug,
	});

	// if the page is not found in the database, check for a payload-managed redirect rule.
	if (!page) {
		return <PayloadRedirects url={url} />;
	}

	// destructure the layout blocks from the page document.
	const { layout } = page;

	return (
		<article>
			{/* payloadredirects checks for redirects even if a page is found (e.g., permanent move).
                'disablenotfound' is set to prevent a 404 if no redirect is matched. */}
			<PayloadRedirects disableNotFound url={url} />

			{/* if draft mode is enabled, render the live preview listener component. */}
			{draft && <LivePreviewListener />}

			{/* render the array of content blocks defined in the page's layout field. */}
			<RenderBlocks blocks={layout || []} />
		</article>
	);
};

/**
 * generates dynamic next.js metadata (seo) for the current page.
 * it fetches the page document and uses the 'generate-meta' utility to construct
 * the final metadata object.
 */
const generateMetadata = async ({ params: paramsPromise }: Args): Promise<Metadata> => {
	// safely get the slug from parameters, defaulting to 'home'.
	const { slug = "home" } = await paramsPromise;

	// fetch the page document data.
	const page = await queryPageBySlug({
		slug,
	});

	// use the utility to create the metadata object from the document data.
	return generateMeta({ doc: page });
};

/**
 * a cached function to fetch a single page document from payload by slug.
 * it respects the current draft mode status to return either published or draft content.
 *
 * @param args.slug - the slug of the page to fetch.
 * @returns the page document object or null if not found.
 */
const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
	// check the current draft mode status.
	const { isEnabled: draft } = await draftMode();

	const payload = await getPayload({ config: config });

	const result = await payload.find({
		collection: "pages",
		// fetch drafts if draft mode is active.
		draft,
		limit: 1,
		pagination: false,
		// override access control in draft mode to ensure unpublished content is visible.
		overrideAccess: draft,
		where: {
			slug: {
				equals: slug,
			},
		},
	});

	// return the first document in the result array or null if none was found.
	return result.docs?.[0] || null;
});

// export the page component, static params generator, and metadata generator.
export { generateStaticParams, Page as default, generateMetadata };
