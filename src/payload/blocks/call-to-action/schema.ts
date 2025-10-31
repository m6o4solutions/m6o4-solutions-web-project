import type { Block } from "payload";

// defines a reusable call-to-action block that links to a cta entry stored in the cms
// enables editors to select an existing cta record instead of recreating content each time
const CallToAction: Block = {
	slug: "callToAction",
	interfaceName: "CallToAction",
	labels: {
		singular: "Call to Action Block",
		plural: "Call to Action Blocks",
	},
	fields: [
		{
			// connects this block to a specific cta document for dynamic reuse
			name: "cta",
			label: "Call to Action",
			type: "relationship",
			relationTo: "cta",
			required: true,
		},
	],
};

export { CallToAction };
