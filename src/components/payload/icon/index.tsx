import { Media } from "@/payload-types";
import config from "@payload-config";
import Image from "next/image";
import { getPayload } from "payload";
import React from "react";

/**
 * a server component responsible for fetching and rendering the organization's icon.
 * this is typically a small, square version of the logo used for favicons or app icons.
 * it retrieves the data from the 'branding' global configuration in payload.
 */
const Icon = async () => {
	// initialize payload instance for server-side data fetching.
	const payload = await getPayload({ config: config });

	// fetch the 'branding' global document.
	const branding = await payload.findGlobal({ slug: "branding" });

	// safely cast the organization icon field to the 'media' type.
	const icon = branding.organizationIcon as Media;

	return (
		// renders the icon using next/image for optimized delivery.
		<Image
			// safely use the icon url, falling back to an empty string.
			src={icon?.url || ""}
			// safely use the icon alt text, falling back to an empty string.
			alt={icon?.alt || ""}
			// set explicit width and height for a small icon size (e.g., 32x32).
			width={32}
			height={32}
			// prioritize loading as this is a critical asset (e.g., in a header).
			priority
		/>
	);
};

// export the server component for use in site layouts.
export { Icon };
