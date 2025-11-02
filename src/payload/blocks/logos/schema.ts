import type { Block } from "payload";

/* defines a structured block for displaying company logos.
   connects to the logos collection, allowing editors to select multiple
   logo entries and pair them with a section headline and subheadline.
   commonly used for client, partner, or sponsor showcase sections. */
const Logos: Block = {
	slug: "logos",
	interfaceName: "Logos",
	labels: {
		singular: "Logo Block",
		plural: "Logo Blocks",
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

		// relational field linking to company logo entries in the logos collection
		{
			name: "companyLogos",
			type: "relationship",
			label: "Companies",
			relationTo: "logos",
			hasMany: true,
			required: true,
		},
	],
};

export { Logos };
