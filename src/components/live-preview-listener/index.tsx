"use client";

import { getClientSideURL } from "@/payload/utilities/get-url";
import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

/**
 * a client-side component that activates payload's live preview functionality.
 * it connects the payload admin's content saving event to the next.js frontend,
 * enabling automatic, soft route refreshes upon document updates.
 */
const LivePreviewListener = () => {
	// initializes the next.js router hook to access client-side navigation methods.
	const router = useRouter();

	return (
		// renders the core payload live preview component.
		<PayloadLivePreview
			// provides the next.js route refresh function, instructing payload's library
			// to execute a soft navigation refresh when content is saved in the admin.
			refresh={router.refresh}
			// provides the base url for the client to communicate with payload's api.
			serverURL={getClientSideURL()}
		/>
	);
};

// export the listener for inclusion in pages that require live preview.
export { LivePreviewListener };
