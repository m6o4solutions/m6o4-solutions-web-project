import { isBrowser } from "@/payload/utilities/is-browser";

/**
 * determines the base url for server-side operations, prioritizing
 * NEXT_PUBLIC_SERVER_URL or a local default.
 * @returns {string} The server-side base url.
 */
const getServerSideURL = () => {
	return process.env.NEXT_PUBLIC_SERVER_URL!;
};

/**
 * determines the base url for client-side operations, reading from
 * the browser's window.location if available, otherwise falling back
 * to server-side environment variables.
 * @returns {string} The client-side base url.
 */
const getClientSideURL = () => {
	if (isBrowser) {
		const protocol = window.location.protocol;
		const domain = window.location.hostname;
		const port = window.location.port;

		return `${protocol}//${domain}${port ? `:${port}` : ""}`;
	}

	return process.env.NEXT_PUBLIC_SERVER_URL!;
};

export { getServerSideURL, getClientSideURL };
