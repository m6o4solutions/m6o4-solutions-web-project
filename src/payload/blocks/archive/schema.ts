import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

/**
 * defines a reusable payload block for dynamically displaying an archive of documents,
 * primarily used for blog posts or similar content lists.
 * it allows content editors to either pull all posts from a collection or select specific posts.
 */
const Archive: Block = {
	// unique identifier for the block.
	slug: "archive",
	// typescript interface name for type safety.
	interfaceName: "Archive",
	// human-readable labels for the admin ui.
	labels: {
		singular: "Post Archive Block",
		plural: "Post Archive Blocks",
	},
	// field definitions for the block content.
	fields: [
		{
			// rich text area for content editors to add an introductory paragraph or heading
			// above the displayed archive list.
			name: "introContent",
			type: "richText",
			label: "Introductory Content",
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					// enables heading, fixed, and inline toolbars for editing the intro content.
					return [
						...rootFeatures,
						HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
						FixedToolbarFeature(),
						InlineToolbarFeature(),
					];
				},
			}),
		},
		{
			// control field to determine the method of populating the archive list.
			name: "populateBy",
			type: "select",
			label: "Populate by",
			defaultValue: "collection",
			options: [
				{
					// option to display posts based on collection/category filters.
					label: "Collection",
					value: "collection",
				},
				{
					// option to manually select individual posts.
					label: "Individual Selection",
					value: "selection",
				},
			],
		},
		{
			// specifies which collection to pull documents from when 'populate by' is 'collection'.
			name: "relationTo",
			type: "select",
			label: "Collections to Show",
			defaultValue: "posts",
			options: [
				{
					label: "Posts",
					value: "posts",
				},
			],
			admin: {
				// this field only appears if the population method is 'collection'.
				condition: (_, siblingData) => siblingData.populateBy === "collection",
			},
		},
		{
			// allows filtering the documents by one or more categories when 'populate by' is 'collection'.
			name: "categories",
			type: "relationship",
			label: "Categories to Show",
			relationTo: "categories",
			hasMany: true,
			admin: {
				// this field only appears if the population method is 'collection'.
				condition: (_, siblingData) => siblingData.populateBy === "collection",
			},
		},
		{
			// sets a maximum number of documents to fetch and display when 'populate by' is 'collection'.
			name: "limit",
			type: "number",
			label: "Limit",
			defaultValue: 9,
			admin: {
				// this field only appears if the population method is 'collection'.
				condition: (_, siblingData) => siblingData.populateBy === "collection",
				step: 1,
			},
		},
		{
			// a relationship field to manually select documents when 'populate by' is 'selection'.
			name: "selectedDocs",
			type: "relationship",
			label: "Selection",
			relationTo: ["posts"],
			hasMany: true,
			admin: {
				// this field only appears if the population method is 'selection'.
				condition: (_, siblingData) => siblingData.populateBy === "selection",
			},
		},
	],
};

// export the block configuration for use in collections/globals.
export { Archive };
