import config from "@payload-config";
import { getServerSideSitemap } from "next-sitemap";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

// cache the function responsible for retrieving service slugs and last modified dates.
// this uses the next.js cache to reduce database load and ensures the sitemap is fast to serve.
const getServicesSitemap = unstable_cache(
	async () => {
		// initialize the payload instance to fetch data.
		const payload = await getPayload({ config });
		// retrieve the base url for generating absolute urls, asserting it will be defined.
		const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

		// query the 'services' collection to retrieve all public service documents.
		const results = await payload.find({
			collection: "services",
			// bypass access control to ensure all services are indexed.
			overrideAccess: false,
			// drafts are excluded by default in the services collection access control, but explicit exclusion here adds clarity.
			draft: false,
			// fetch shallow data as we only need two fields for the sitemap.
			depth: 0,
			// set a high limit to prevent pagination and retrieve all services in one go.
			limit: 1000,
			pagination: false,
			// note: the 'services' collection uses 'isPublic' read access, so no explicit _status check is strictly necessary here
			// but we keep the structure clean by only selecting necessary fields.
			select: {
				slug: true,
				updatedAt: true,
			},
		});

		// create a timestamp fallback for documents that might be missing an updatedAt field.
		const dateFallback = new Date().toISOString();

		// map the payload documents to the sitemap format required by next-sitemap.
		const sitemap = results.docs
			? results.docs
					// filter out any services that might not have a slug defined.
					.filter((service) => Boolean(service?.slug))
					.map((service) => ({
						// construct the full absolute url using the service prefix and the slug.
						loc: `${SITE_URL}/services/${service?.slug}`,
						// use the service's last updated time or the fallback date.
						lastmod: service.updatedAt || dateFallback,
					}))
			: [];

		// return the array of sitemap entries.
		return sitemap;
	},
	// define the key for this cache entry.
	["services-sitemap"],
	{
		// use the 'services-sitemap' tag so that the payload hook can easily revalidate (bust) this cache when a service is updated.
		tags: ["services-sitemap"],
	},
);

// route handler for the /services-sitemap.xml path.
export async function GET() {
	// execute the cached function to get the sitemap data.
	const sitemap = await getServicesSitemap();

	// convert the array of sitemap objects into the xml response and serve it.
	return getServerSideSitemap(sitemap);
}
