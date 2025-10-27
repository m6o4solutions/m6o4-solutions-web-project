import { Media } from "@/payload-types";
import config from "@payload-config";
import Image from "next/image";
import { getPayload } from "payload";
import React from "react";

/**
 * a server component responsible for fetching and rendering the organization's logo.
 * it retrieves the logo from the 'branding' global configuration in payload
 * and uses next/image for optimized display.
 */
const Logo = async () => {
	// initialize payload instance for server-side data fetching.
	const payload = await getPayload({ config: config });

	// fetch the 'branding' global document to get the logo data.
	const branding = await payload.findGlobal({ slug: "branding" });

	// cast the organization logo field to the 'media' type for type safety.
	const logo = branding.organizationLogo as Media;

	return (
		// renders the logo using next/image for performance.
		<Image
			// safely use the logo url, falling back to an empty string.
			src={logo?.url || ""}
			// safely use the logo alt text, falling back to an empty string.
			alt={logo?.alt || ""}
			// set explicit width and height for layout shift prevention.
			width={100}
			height={100}
			// prioritize loading for a better user experience on initial page load.
			priority
		/>
	);
};

// export the server component for use in site headers or footers.
export { Logo };
