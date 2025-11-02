import type { Block } from "payload";

/* defines a reusable payload block for displaying client testimonials.
   intended for use in flexible page layouts where multiple testimonials can be showcased. */
const Testimonials: Block = {
	slug: "testimonials",
	interfaceName: "Testimonials",

	/* defines how the block appears in the cms interface */
	labels: {
		singular: "Testimonials Block",
		plural: "Testimonials Blocks",
	},

	/* configures the block fields for content editors */
	fields: [
		{
			/* main heading introducing the testimonials section */
			name: "headline",
			type: "text",
			label: "Headline",
			required: true,
		},
		{
			/* optional secondary line providing additional context or emphasis */
			name: "subheadline",
			type: "text",
			label: "Subheadline",
		},
		{
			/* connects this block to multiple testimonial entries for dynamic population */
			name: "testimonials",
			type: "relationship",
			label: "Select Testimonies",
			relationTo: "testimonials",
			hasMany: true,
			required: true,
		},
	],
};

/* exports the block configuration for inclusion in payload layouts */
export { Testimonials };
