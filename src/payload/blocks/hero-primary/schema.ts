import { link } from "@/payload/fields/link";
import type { Block } from "payload";

/**
 * defines the 'primary hero block', a reusable payload layout block.
 * this block is intended for a page's main, high-impact section, featuring
 * a headline, text, call-to-action, and a prominent image.
 */
const HeroPrimary: Block = {
	// unique identifier for the block.
	slug: "heroPrimary",
	// typescript interface name for strong typing.
	interfaceName: "HeroPrimary",
	labels: {
		singular: "Primary Hero Block",
		plural: "Primary Hero Blocks",
	},
	fields: [
		{
			// main heading text field.
			name: "headline",
			type: "text",
			label: "Headline",
			required: true,
		},
		{
			// supporting text below the headline.
			name: "subHeadline",
			type: "textarea",
			label: "Sub Headline",
			required: true,
		},
		{
			// field for selecting the main visual media (image) for the hero.
			name: "media",
			type: "upload",
			label: "Media",
			// relates this field to the 'media' collection.
			relationTo: "media",
			required: true,
		},
		{
			// array field for one or more call-to-action buttons.
			name: "ctaItems",
			type: "array",
			label: "Call to Action Items",
			labels: {
				singular: "Call to Action Item",
				plural: "Call to Action Items",
			},
			fields: [
				// incorporates a reusable link field configuration.
				link({
					// disables the link's appearance field, as the component will enforce button styling.
					appearances: false,
				}),
			],
			// enforces a limit of one cta item to maintain design consistency and focus.
			maxRows: 1,
			admin: {
				components: {
					// specifies a custom react component to provide a human-readable label for the array row in the admin ui.
					RowLabel: "@/payload/blocks/hero-primary/row-label#RowLabel",
				},
				// keeps the array field closed by default to reduce form clutter.
				initCollapsed: true,
			},
		},
	],
};

// export the block configuration.
export { HeroPrimary };
