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
					label: "name",
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
					label: "slogan",
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
			label: "logo",
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
			label: "social media",
			labels: {
				singular: "social media link",
				plural: "social media links",
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
			label: "services column",
			fields: [
				{
					// header text for the services column.
					name: "serviceHeader",
					type: "text",
					label: "header",
				},
				{
					// array of links for services.
					name: "serviceItems",
					type: "array",
					label: "service items",
					labels: {
						singular: "service link",
						plural: "service links",
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
			label: "business column",
			fields: [
				{
					// header text for the business column.
					name: "businessHeader",
					type: "text",
					label: "header",
				},
				{
					// array of links for business-related pages.
					name: "businessItems",
					type: "array",
					label: "business items",
					labels: {
						singular: "business link",
						plural: "business links",
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
			label: "legal column",
			fields: [
				{
					// header text for the legal column.
					name: "legalHeader",
					type: "text",
					label: "header",
				},
				{
					// array of links for legal pages (e.g., privacy, terms).
					name: "legalItems",
					type: "array",
					label: "legal items",
					labels: {
						singular: "legal link",
						plural: "legal links",
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
			label: "copyright notice",
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
