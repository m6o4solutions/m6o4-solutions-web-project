import type { Block } from "payload";

/* defines a payload block for displaying lists of documents such as blog posts.
   designed to offer editors control over how entries are chosen and presented. */
const Archive: Block = {
	slug: "archive",
	interfaceName: "Archive",

	/* identifies the block in the cms editor */
	labels: {
		singular: "Post Archive Block",
		plural: "Post Archive Blocks",
	},

	/* configures the block fields that control display and data sourcing */
	fields: [
		{
			/* main title introducing the archive section */
			name: "headline",
			type: "text",
			label: "Headline",
		},
		{
			/* optional short description providing context for the section */
			name: "subheadline",
			type: "text",
			label: "Subheadline",
		},
		{
			/* defines whether items are pulled automatically or selected manually */
			name: "populateBy",
			type: "select",
			label: "Populate by",
			defaultValue: "collection",
			options: [
				{ label: "Collection", value: "collection" },
				{ label: "Individual Selection", value: "selection" },
			],
		},
		{
			/* selects which collection to pull data from when auto-populating */
			name: "relationTo",
			type: "select",
			label: "Collections to Show",
			defaultValue: "posts",
			options: [{ label: "Posts", value: "posts" }],
			admin: {
				/* visible only when auto mode is active */
				condition: (_, siblingData) => siblingData.populateBy === "collection",
			},
		},
		{
			/* enables filtering by specific categories when fetching automatically */
			name: "categories",
			type: "relationship",
			label: "Categories to Show",
			relationTo: "categories",
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.populateBy === "collection",
			},
		},
		{
			/* sets the maximum number of documents displayed in auto mode */
			name: "limit",
			type: "number",
			label: "Limit",
			defaultValue: 9,
			admin: {
				condition: (_, siblingData) => siblingData.populateBy === "collection",
				step: 1,
			},
		},
		{
			/* allows manual document selection when auto-population is disabled */
			name: "selectedDocs",
			type: "relationship",
			label: "Selection",
			relationTo: ["posts"],
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.populateBy === "selection",
			},
		},
		{
			/* defines the background tone for the archive block’s visual presentation */
			name: "backgroundColor",
			type: "select",
			label: "Background Color",
			defaultValue: "white",
			options: [
				{ label: "White", value: "white" },
				{ label: "Subtle Gray", value: "subtle" },
			],
		},
	],
};

/* exports the archive block for use in payload layouts and page builders */
export { Archive };
