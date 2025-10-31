import type { Block } from "payload";

/* defines a reusable block for displaying grouped service cards under a shared heading.
   each instance includes a main headline, a subheadline for context, and up to three service cards.
   each card contains an image, title, short description, and link to a related page or resource. */
const ContentCards: Block = {
	slug: "contentCards",
	interfaceName: "ContentCards",
	labels: {
		singular: "Content Card Block",
		plural: "Content Card Blocks",
	},
	fields: [
		{
			name: "headline",
			type: "text",
			label: "Headline",
			required: true,
		},
		{
			name: "subheadline",
			type: "text",
			label: "Subheadline",
			required: true,
		},
		{
			name: "services",
			type: "array",
			label: "Services",
			labels: {
				singular: "Service",
				plural: "Services",
			},
			required: true,
			maxRows: 3,
			fields: [
				{
					name: "image",
					type: "upload",
					label: "Service Image",
					relationTo: "media",
					required: true,
				},
				{
					name: "title",
					type: "text",
					label: "Service Title",
					required: true,
				},
				{
					name: "description",
					type: "textarea",
					label: "Service Description",
					required: true,
				},
				{
					name: "link",
					type: "text",
					label: "Service Link",
					required: true,
				},
			],
		},
	],
};

export { ContentCards };
