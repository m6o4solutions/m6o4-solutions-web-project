"use client";

// imports the router hook from next/navigation for programmatic navigation/refreshing.
// imports a utility to get the correct base url for client-side API requests.
import { getClientSideURL } from "@/payload/utilities/get-url";
// imports the specific component from the payload live preview library.
// 'refreshrouteonsave' is used to trigger a next.js route refresh when a document is saved in payload.
import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

/**
 * @component livepreviewlistener
 * @description sets up a listener to enable real-time live preview functionality
 * between the payload admin dashboard and the next.js frontend.
 * it tells payload's library how to refresh the current next.js route when content is saved.
 */
const LivePreviewListener = () => {
	// initializes the next.js router instance.
	const router = useRouter();

	return (
		// renders the payload live preview component.
		<PayloadLivePreview
			// passes the next.js router's refresh method to payload, which executes
			// a soft refresh of the current page's data without a full page reload.
			refresh={router.refresh}
			// passes the base url of the next.js application to the payload component
			// so it knows where to look for content/api endpoints.
			serverURL={getClientSideURL()}
		/>
	);
};

export { LivePreviewListener };
