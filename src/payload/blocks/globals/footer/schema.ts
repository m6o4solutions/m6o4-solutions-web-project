import { isPublic } from "@/payload/access/access-control";
import { revalidateFooter } from "@/payload/blocks/globals/footer/hooks/revalidate-footer";
import { link } from "@/payload/fields/link";
import type { GlobalConfig } from "payload";

/**
 * defines the payload global configuration for the 'footer' singleton.
 * this single document manages all content for the site's footer, including
 * company info, social links, and navigation columns.
 */
const Footer: GlobalConfig = {
	// unique identifier for the global document.
	slug: "footer",
	// access control ensures the footer data is publicly readable for frontend display.
	access: {
		read: isPublic,
	},
	// field definitions for the footer content.
	fields: [
		{
			// groups organization name and slogan into a single row for efficient entry.
			type: "row",
			fields: [
				{
					// the name of the organization, mandatory.
					name: "organizationName",
					type: "text",
					label: "Name",
					required: true,
					admin: {
						// allocate 50% of the row width to this field.
						width: "50%",
					},
				},
				{
					// the organization's slogan or tagline, mandatory.
					name: "organizationSlogan",
					type: "text",
					label: "Slogan",
					required: true,
					admin: {
						// allocate 50% of the row width to this field.
						width: "50%",
					},
				},
			],
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
			// array of links for social media profiles.
			name: "socialItems",
			type: "array",
			label: "Social Media",
			labels: {
				singular: "Social Media Link",
				plural: "Social Media Links",
			},
			fields: [
				// imports the reusable link field configuration.
				link({
					// disables the appearance field since the footer will handle link styling (e.g., icons).
					appearances: false,
				}),
			],
			// maximum of 3 social media links to keep the footer clean.
			maxRows: 3,
			admin: {
				components: {
					// uses a custom component to generate a readable label for each row in the admin ui.
					RowLabel: "@/payload/blocks/globals/footer/row-label#RowLabel",
				},
				// keeps the array field collapsed by default.
				initCollapsed: true,
			},
		},
		{
			// groups fields for the 'services' navigation column.
			name: "services",
			type: "group",
			label: "Services Column",
			fields: [
				{
					// header text for the services column.
					name: "serviceHeader",
					type: "text",
					label: "Header",
				},
				{
					// array of links for services.
					name: "serviceItems",
					type: "array",
					label: "Service Items",
					labels: {
						singular: "Service Link",
						plural: "Service Links",
					},
					fields: [
						link({
							appearances: false,
						}),
					],
					// maximum of 3 service links.
					maxRows: 3,
					admin: {
						components: {
							RowLabel: "@/payload/blocks/globals/footer/row-label#RowLabel",
						},
						initCollapsed: true,
					},
				},
			],
		},
		{
			// groups fields for the 'business' navigation column.
			name: "business",
			type: "group",
			label: "Business Column",
			fields: [
				{
					// header text for the business column.
					name: "businessHeader",
					type: "text",
					label: "Header",
				},
				{
					// array of links for business-related pages.
					name: "businessItems",
					type: "array",
					label: "Business Items",
					labels: {
						singular: "Business Link",
						plural: "Business Links",
					},
					fields: [
						link({
							appearances: false,
						}),
					],
					// maximum of 3 business links.
					maxRows: 3,
					admin: {
						components: {
							RowLabel: "@/payload/blocks/globals/footer/row-label#RowLabel",
						},
						initCollapsed: true,
					},
				},
			],
		},
		{
			// groups fields for the 'legal' navigation column.
			name: "legal",
			type: "group",
			label: "Legal Column",
			fields: [
				{
					// header text for the legal column.
					name: "legalHeader",
					type: "text",
					label: "Header",
				},
				{
					// array of links for legal pages (e.g., privacy, terms).
					name: "legalItems",
					type: "array",
					label: "Legal Items",
					labels: {
						singular: "Legal Link",
						plural: "Legal Links",
					},
					fields: [
						link({
							appearances: false,
						}),
					],
					// maximum of 2 legal links.
					maxRows: 2,
					admin: {
						components: {
							RowLabel: "@/payload/blocks/globals/footer/row-label#RowLabel",
						},
						initCollapsed: true,
					},
				},
			],
		},
		{
			// the main copyright text to display at the bottom of the footer, mandatory.
			name: "copyright",
			type: "text",
			label: "Copyright Notice",
			required: true,
		},
	],
	hooks: {
		// triggers next.js cache revalidation for the entire site after any change to the footer.
		afterChange: [revalidateFooter],
	},
};

// export the global config for use in the main payload config file.
export { Footer };
