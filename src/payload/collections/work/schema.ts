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

const Work: CollectionConfig = {
	slug: "work",
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isPublic,
		update: isAuthenticated,
	},
	admin: {
		defaultColumns: ["title", "industry", "createdAt", "updatedAt"],
		useAsTitle: "title",
	},
	labels: {
		singular: "Work",
		plural: "Work",
	},
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "title",
					type: "text",
					label: "Title",
					required: true,
					admin: {
						width: "70%",
					},
				},
				{
					name: "industry",
					type: "text",
					label: "Industry",
					admin: {
						width: "30%",
					},
				},
			],
		},
		...slugField(),
		{
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
			required: true,
		},
		{
			name: "content",
			type: "richText",
			label: "Content",
			required: true,
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					return [
						...rootFeatures,
						HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
						BlocksFeature({ blocks: [Banner] }),
						FixedToolbarFeature(),
						InlineToolbarFeature(),
						HorizontalRuleFeature(),
					];
				},
			}),
		},
	],
};

export { Work };
