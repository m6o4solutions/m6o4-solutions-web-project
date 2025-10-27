import type { Header } from "@/payload-types";
import { HeaderClient } from "@/payload/blocks/globals/header/component-client";
import { getCachedGlobal } from "@/payload/utilities/get-globals";

/**
 * server component responsible for fetching the header global data.
 * it utilizes next.js caching with getcachedglobal for efficient data retrieval
 * and passes the data to a client component for interactivity.
 *
 * @returns the client-side header component with the fetched data.
 */
const Header = async () => {
	// fetch the 'header' global singleton from payload, ensuring the depth is 1 to get necessary relationship data.
	// getcachedglobal is used to leverage next.js's data caching mechanism.
	const headerData: Header = await getCachedGlobal("header", 1)();

	// renders the client component, passing the server-fetched data as a prop.
	return <HeaderClient data={headerData} />;
};

// export the server component for use in layout files.
export { Header };
