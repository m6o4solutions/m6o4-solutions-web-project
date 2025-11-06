import type { Block } from "payload";

const ContentCardsWork: Block = {
	slug: "contentCardsWork",
	interfaceName: "ContentCardsWork",
	labels: {
		singular: "Content Cards Work Block",
		plural: "Content Cards Work Blocks",
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
