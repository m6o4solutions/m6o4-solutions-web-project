import type { Block } from "payload";

const ContentCardsWork: Block = {
	slug: "contentCardsWork",
	interfaceName: "ContentCardsWork",
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
			name: "work",
			type: "relationship",
			relationTo: "work",
			hasMany: true,
			required: true,
		},
	],
};

export { ContentCardsWork };
