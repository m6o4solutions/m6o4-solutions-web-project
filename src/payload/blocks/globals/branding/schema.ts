import type { GlobalConfig } from "payload";

/**
 * defines the payload global configuration for the 'branding' singleton.
 * this document stores media assets like the organization's icon and logo
 * for consistent use across the application, such as in favicons and headers.
 */
const Branding: GlobalConfig = {
	// unique identifier for the global document.
	slug: "branding",
	// field definitions for the branding content.
	fields: [
		{
			// groups the icon and logo into a single row for better organization in the admin ui.
			type: "row",
			fields: [
				{
					// a small, square version of the logo (e.g., favicon, app icon), mandatory.
					name: "organizationIcon",
					label: "Icon",
					type: "upload",
					required: true,
					// links this field to the 'media' collection.
					relationTo: "media",
				},
				{
					// the full, horizontal logo of the organization (e.g., for header), optional.
					name: "organizationLogo",
					label: "Logo",
					type: "upload",
					// links this field to the 'media' collection.
					relationTo: "media",
				},
			],
		},
	],
};

// export the global config for use in the main payload config file.
export { Branding };
