import { link } from "@/payload/fields/link";
import type { Block } from "payload";

const HeroPrimary: Block = {
	slug: "heroPrimary",
	interfaceName: "HeroPrimary",
	labels: {
		singular: "Primary Hero Block",
		plural: "Primary Hero Blocks",
	},
	fields: [
		{
			name: "headline",
			type: "text",
			label: "Headline",
			required: true,
		},
		{
			name: "subHeadline",
			type: "textarea",
			label: "Sub Headline",
			required: true,
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
					RowLabel: "@/payload/blocks/hero-primary/row-label#RowLabel",
				},
				// keeps the array field collapsed by default for a cleaner form.
				initCollapsed: true,
			},
		},
		{
			name: "media",
			type: "upload",
			label: "Media",
			relationTo: "media",
			required: true,
		},
	],
};

export { HeroPrimary };
