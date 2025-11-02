import type { Block } from "payload";

// defines a reusable grid block for structured page sections.
// enables editors to present concise, repeatable content in a balanced layout.
const ContentGrid: Block = {
	slug: "contentGrid",
	interfaceName: "ContentGrid",
	labels: {
		singular: "Content Grid Block",
		plural: "Content Grid Blocks",
	},
	fields: [
		// main heading used to introduce the section and set context
		{
			name: "headline",
			type: "text",
			label: "Headline",
			required: true,
		},
		// secondary heading that supports or clarifies the main headline
		{
			name: "subheadline",
			type: "text",
			label: "Subheadline",
			required: true,
		},
		// grid content items representing individual points of focus
		{
			name: "gridItems",
			type: "array",
			label: "Items",
			labels: {
				singular: "Item",
				plural: "Items",
			},
			required: true,
			maxRows: 8, // prevents overcrowding and keeps layouts visually balanced
			fields: [
				// configurable header element displayed above each item title
				{
					name: "itemHead",
					type: "group",
					label: "Item Head",
					fields: [
						// determines whether the header displays text or an icon
						{
							name: "type",
							type: "select",
							label: "Type",
							required: true,
							defaultValue: "text",
							options: [
								{ label: "Text", value: "text" },
								{ label: "Icon", value: "icon" },
							],
						},
						// used when a simple text label is preferred over an icon
						{
							name: "text",
							type: "text",
							label: "Text",
							admin: {
								condition: (_, siblingData) => siblingData?.type === "text",
							},
						},
						// provides icon selection for visually symbolic headers
						{
							name: "icon",
							type: "select",
							label: "Icon",
							admin: {
								condition: (_, siblingData) => siblingData?.type === "icon",
							},
							options: [
								{ label: "Ban", value: "ban" },
								{ label: "Brain", value: "brain" },
								{ label: "Check", value: "check" },
								{ label: "Chevrons Down", value: "chevronsDown" },
								{ label: "Chevrons Up", value: "chevronsUp" },
								{ label: "Cloud", value: "cloud" },
								{ label: "CPU", value: "cpu" },
								{ label: "Dollar Sign", value: "dollarSign" },
								{ label: "Globe", value: "globe" },
								{ label: "Shield", value: "shield" },
								{ label: "Trending Down", value: "trendingDown" },
								{ label: "Trending Up", value: "trendingUp" },
								{ label: "Zap", value: "zap" },
							],
						},
					],
				},
				// concise, descriptive title conveying each item's key message
				{
					name: "itemTitle",
					type: "text",
					label: "Item Title",
					required: true,
				},
				// supporting paragraph giving context or elaboration
				{
					name: "itemDescription",
					type: "textarea",
					label: "Item Description",
					required: true,
				},
				// optional link allowing users to explore more about the item
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
