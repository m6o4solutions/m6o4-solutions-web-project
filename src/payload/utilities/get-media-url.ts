import { getClientSideURL } from "@/payload/utilities/get-url";

/**
 * processes media resource URL to ensure proper formatting
 * @param url the original URL from the resource
 * @param cacheTag optional cache tag to append to the URL
 * @returns properly formatted URL with cache tag if provided
 */
const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
	if (!url) return "";

	if (cacheTag && cacheTag !== "") {
		cacheTag = encodeURIComponent(cacheTag);
	}

	// check if URL already has http/https protocol
	if (url.startsWith("http://") || url.startsWith("https://")) {
		return cacheTag ? `${url}?${cacheTag}` : url;
	}

	// otherwise prepend client-side URL
	const baseUrl = getClientSideURL();
	return cacheTag ? `${baseUrl}${url}?${cacheTag}` : `${baseUrl}${url}`;
};

export { getMediaUrl };
