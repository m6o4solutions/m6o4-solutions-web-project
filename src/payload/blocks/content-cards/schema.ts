import type { Block } from "payload";

/* defines a reusable block for displaying grouped service cards under a shared heading.
   each instance includes a main headline, a subheadline for context, and up to three service cards.
   each card contains an image, title, short description, and link to a related page or resource. */
const ContentCards: Block = {
	slug: "contentCards",
	interfaceName: "ContentCards",
	labels: {
		singular: "Content Cards Block",
		plural: "Content Cards Blocks",
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
		},
		{
			name: "gridCards",
			type: "array",
			label: "Cards",
			labels: {
				singular: "Card",
				plural: "Cards",
			},
			required: true,
			maxRows: 3,
			fields: [
				{
					name: "cardImage",
					type: "upload",
					label: "Card Image",
					relationTo: "media",
					required: true,
				},
				{
					name: "cardTitle",
					type: "text",
					label: "Card Title",
					required: true,
				},
				{
					name: "cardDescription",
					type: "textarea",
					label: "Card Description",
					required: true,
				},
				{
					name: "cardLink",
					type: "text",
					label: "Card Link",
					required: true,
				},
			],
		},
	],
};

export { ContentCards };
