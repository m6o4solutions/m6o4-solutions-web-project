import type { Block } from "payload";

/**
 * defines the 'secondary hero block', a reusable payload layout block.
 * this block is intended for a sub page's main, high-impact section, featuring
 * a headline, text, and a prominent image.
 */
const HeroSecondary: Block = {
	// unique identifier for the block.
	slug: "heroSecondary",
	// typescript interface name for strong typing.
	interfaceName: "HeroSecondary",
	labels: {
		singular: "Secondary Hero Block",
		plural: "Secondary Hero Blocks",
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
			label: "Subheadline",
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
	],
};

export { HeroSecondary };
