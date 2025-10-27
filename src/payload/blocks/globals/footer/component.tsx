import type { Footer } from "@/payload-types";
import { FooterClient } from "@/payload/blocks/globals/footer/component-client";
import { getCachedGlobal } from "@/payload/utilities/get-globals";

/**
 * server component responsible for fetching the footer global data.
 * it utilizes next.js caching with getcachedglobal for efficient data retrieval
 * and passes the data to a client component for rendering.
 *
 * @returns the client-side footer component with the fetched data.
 */
const Footer = async () => {
	// fetch the 'footer' global singleton from payload, ensuring the depth is 1 to get necessary relationship data.
	// getcachedglobal is used to leverage next.js's data caching mechanism.
	const footerData: Footer = await getCachedGlobal("footer", 1)();

	// renders the client component, passing the server-fetched data as a prop.
	return <FooterClient data={footerData} />;
};

// export the server component for use in layout files.
export { Footer };
