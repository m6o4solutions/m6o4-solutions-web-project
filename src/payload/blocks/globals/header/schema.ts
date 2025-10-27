import { isPublic } from "@/payload/access/access-control";
import { revalidateHeader } from "@/payload/blocks/globals/header/hooks/revalidate-header";
import { link } from "@/payload/fields/link";
import type { GlobalConfig } from "payload";

/**
 * defines the payload global configuration for the 'header' singleton.
 * this single document manages all content for the site's main header/navigation bar.
 */
const Header: GlobalConfig = {
	// unique identifier for the global document.
	slug: "header",
	// access control ensures the header data is publicly readable for frontend display.
	access: {
		read: isPublic,
	},
	// field definitions for the header content.
	fields: [
		{
			// the name of the organization to display in the header, mandatory.
			name: "organizationName",
			type: "text",
			label: "Name",
			required: true,
		},
		{
			// the organization's logo, linked to the 'media' collection, mandatory.
			name: "organizationLogo",
			label: "Logo",
			type: "upload",
			relationTo: "media",
			required: true,
			admin: {
				// places the logo field in the admin sidebar.
				position: "sidebar",
			},
		},
		{
			// array of links that make up the main navigation menu.
			name: "navigationItems",
			type: "array",
			label: "Navigation Items",
			labels: {
				singular: "Navigation Item",
				plural: "Navigation Items",
			},
			fields: [
				// imports the reusable link field configuration.
				link({
					// disables the appearance field since the header will handle link styling.
					appearances: false,
				}),
			],
			// maximum of 5 main navigation links to keep the header clean.
			maxRows: 5,
			admin: {
				components: {
					// uses a custom component to generate a readable label for each row in the admin ui.
					RowLabel: "@/payload/blocks/globals/header/row-label#RowLabel",
				},
				// keeps the array field collapsed by default for a cleaner form.
				initCollapsed: true,
			},
		},
		{
			// array of links for call-to-action buttons in the header (e.g., "get a quote").
			name: "ctaItems",
			type: "array",
			label: "Call to Action Items",
			labels: {
				singular: "Call to Action Item",
				plural: "Call to Action Items",
			},
			fields: [
				// imports the reusable link field configuration.
				link({
					// disables the appearance field since the header will handle link styling.
					appearances: false,
				}),
			],
			// limits the array to a single call-to-action button for focus.
			maxRows: 1,
			admin: {
				components: {
					// uses a custom component to generate a readable label for each row in the admin ui.
					RowLabel: "@/payload/blocks/globals/header/row-label#RowLabel",
				},
				// keeps the array field collapsed by default for a cleaner form.
				initCollapsed: true,
			},
		},
	],
	hooks: {
		// triggers next.js cache revalidation for the entire site after any change to the header.
		afterChange: [revalidateHeader],
	},
};

// export the global config for use in the main payload config file.
export { Header };
