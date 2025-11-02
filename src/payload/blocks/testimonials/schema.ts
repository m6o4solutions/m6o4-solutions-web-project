import type { Block } from "payload";

const Testimonials: Block = {
	slug: "testimonials",
	interfaceName: "Testimonials",
	labels: {
		singular: "Testimonials Block",
		plural: "Testimonials Blocks",
	},
	fields: [
		// primary title for the logo section
		{
			name: "headline",
			type: "text",
			label: "Headline",
			required: true,
		},

		// optional supporting line that adds context or description
		{
			name: "subheadline",
			type: "text",
			label: "Subheadline",
			required: true,
		},

		{
			name: "testimonies",
			type: "relationship",
			label: "Testimonies",
			relationTo: "testimonials",
			hasMany: true,
			required: true,
		},
	],
};

export { Testimonials };
