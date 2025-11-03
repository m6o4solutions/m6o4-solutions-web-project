import type { Block } from "payload";

/* defines a reusable payload block for listing documents such as blog posts.
   gives editors flexibility to either auto-populate from a collection or manually select entries. */
const Archive: Block = {
	slug: "archive",
	interfaceName: "Archive",

	/* defines how the block appears in the cms interface */
	labels: {
		singular: "Post Archive Block",
		plural: "Post Archive Blocks",
	},

	/* defines editable fields controlling how archive data is displayed and populated */
	fields: [
		{
			/* heading displayed above the archive section */
			name: "headline",
			type: "text",
			label: "Headline",
		},
		{
			/* optional supporting text providing context for the archive */
			name: "subheadline",
			type: "text",
			label: "Subheadline",
		},
		{
			/* determines whether posts are fetched automatically or selected manually */
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
			/* specifies the source collection when using automated population */
			name: "relationTo",
			type: "select",
			label: "Collections to Show",
			defaultValue: "posts",
			options: [{ label: "Posts", value: "posts" }],
			admin: {
				/* only visible when the block is set to populate by collection */
				condition: (_, siblingData) => siblingData.populateBy === "collection",
			},
		},
		{
			/* allows category-based filtering for finer control of displayed items */
			name: "categories",
			type: "relationship",
			label: "Categories to Show",
			relationTo: "categories",
			hasMany: true,
			admin: {
				/* only visible when using automated population */
				condition: (_, siblingData) => siblingData.populateBy === "collection",
			},
		},
		{
			/* defines the maximum number of items to display when fetching from a collection */
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
			/* enables manual selection of specific documents when not using collection mode */
			name: "selectedDocs",
			type: "relationship",
			label: "Selection",
			relationTo: ["posts"],
			hasMany: true,
			admin: {
				/* only visible when populate mode is set to selection */
				condition: (_, siblingData) => siblingData.populateBy === "selection",
			},
		},
	],
};

/* exports the block definition for integration into payload collections or globals */
export { Archive };
