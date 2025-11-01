import type { Block } from "payload";

/* defines a structured content grid block for flexible page layouts.
   used when displaying short, repeatable informational sections in a grid format.
   supports up to four items to maintain balanced visual composition and readability. */
const ContentGrid: Block = {
	slug: "contentGrid",
	interfaceName: "ContentGrid",
	labels: {
		singular: "Content Grid Block",
		plural: "Content Grid Blocks",
	},
	fields: [
		/* sets primary heading for the section to guide user attention */
		{
			name: "headline",
			type: "text",
			label: "Headline",
			required: true,
		},
		/* provides secondary heading to elaborate or contextualize the main title */
		{
			name: "subheadline",
			type: "text",
			label: "Subheadline",
			required: true,
		},
		/* defines individual grid items, each representing a concise content unit */
		{
			name: "gridItems",
			type: "array",
			label: "Items",
			labels: {
				singular: "Item",
				plural: "Items",
			},
			required: true,
			maxRows: 4, // limits grid size for design consistency
			fields: [
				/* short label or category name displayed above the main item title */
				{
					name: "itemHead",
					type: "text",
					label: "Item Head",
					required: true,
				},
				/* main title of the grid item conveying the key message */
				{
					name: "itemTitle",
					type: "text",
					label: "Item Title",
					required: true,
				},
				/* supporting text providing more details about the item */
				{
					name: "itemDescription",
					type: "textarea",
					label: "Item Description",
					required: true,
				},
				/* optional link for users to explore more about the item */
				{
					name: "itemlink",
					type: "text",
					label: "Item Link",
				},
			],
		},
	],
};

export { ContentGrid };
