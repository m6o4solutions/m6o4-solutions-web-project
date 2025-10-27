import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { Banner } from "@/payload/blocks/banner/schema";
import { slugField } from "@/payload/fields/slug";
import {
	BlocksFeature,
	FixedToolbarFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	InlineToolbarFeature,
	lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

/**
 * defines the payload collection configuration for 'work' items.
 * this collection is intended to showcase project case studies or client work.
 */
const Work: CollectionConfig = {
	// collection identifier in the database and api
	slug: "work",
	// access control defines permissions for collection actions.
	access: {
		// only authenticated users can create new 'work' entries.
		create: isAuthenticated,
		// only authenticated users can delete 'work' entries.
		delete: isAuthenticated,
		// all users, public and authenticated, can read 'work' entries.
		read: isPublic,
		// only authenticated users can update existing 'work' entries.
		update: isAuthenticated,
	},
	// admin configuration for the cms interface.
	admin: {
		// columns displayed by default in the list view.
		defaultColumns: ["title", "industry", "createdAt", "updatedAt"],
		// determines which field to use as the title in the admin breadcrumbs and ui.
		useAsTitle: "title",
	},
	// human-readable labels for the collection in the cms.
	labels: {
		singular: "Work",
		plural: "Work",
	},
	// field definitions for the 'work' collection.
	fields: [
		{
			// groups 'title' and 'industry' fields into a single row for better admin layout.
			type: "row",
			fields: [
				{
					// primary title for the work piece, mandatory.
					name: "title",
					type: "text",
					label: "Title",
					required: true,
					admin: {
						// allocate 70% of the row width to the title field.
						width: "70%",
					},
				},
				{
					// industry associated with the project.
					name: "industry",
					type: "text",
					label: "Industry",
					admin: {
						// allocate 30% of the row width to the industry field.
						width: "30%",
					},
				},
			],
		},
		// adds a reusable slug field based on the title for clean urls.
		...slugField(),
		{
			// selection of the service type provided for this work.
			name: "solution",
			type: "select",
			label: "Solution",
			options: [
				{
					label: "Website as a Service",
					value: "waas",
				},
				{
					label: "Chief Technology Officer as a Service",
					value: "ctoaas",
				},
			],
			// solution must be selected for every work item.
			required: true,
		},
		{
			// main body content using the lexical rich text editor.
			name: "content",
			type: "richText",
			label: "Content",
			required: true,
			// configures the lexical editor with specific features.
			editor: lexicalEditor({
				// customizes the features available in the editor.
				features: ({ rootFeatures }) => {
					return [
						// include all default rich text features.
						...rootFeatures,
						// enables heading elements up to h4.
						HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
						// allows embedding the 'banner' block within the content.
						BlocksFeature({ blocks: [Banner] }),
						// sets the toolbar to be fixed at the top of the editor.
						FixedToolbarFeature(),
						// enables the floating toolbar for inline text formatting.
						InlineToolbarFeature(),
						// enables horizontal rule insertion for content separation.
						HorizontalRuleFeature(),
					];
				},
			}),
		},
	],
};

// export the collection config for use in payload.
export { Work };
