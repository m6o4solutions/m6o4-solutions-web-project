import { isAuthenticated, isAuthenticatedOrPublished } from "@/payload/access/access-control";
import { Banner } from "@/payload/blocks/banner/schema";
import { Code } from "@/payload/blocks/code/schema";
import { Media } from "@/payload/blocks/media/schema";
import { populateAuthors } from "@/payload/collections/posts/hooks/populate-authors";
import { revalidateDelete, revalidatePost } from "@/payload/collections/posts/hooks/revalidate-post";
import { slugField } from "@/payload/fields/slug";
import { generatePreviewPath } from "@/payload/utilities/generate-preview-path";
import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from "@payloadcms/plugin-seo/fields";
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
 * payload cms configuration for the 'posts' collection.
 * this defines the structure, rich text editor, access control, and behavior of the blog content.
 */
const Posts: CollectionConfig<"posts"> = {
	// collection identifier in the database and api
	slug: "posts",
	// access control defines permissions for collection actions.
	access: {
		// only authenticated users can create new posts.
		create: isAuthenticated,
		// only authenticated users can delete posts.
		delete: isAuthenticated,
		// public can read only if the post is explicitly published; otherwise, only authenticated can read.
		read: isAuthenticatedOrPublished,
		// only authenticated users can update existing posts.
		update: isAuthenticated,
	},
	// defines fields that are automatically populated when this post is a relationship.
	defaultPopulate: {
		title: true,
		slug: true,
		categories: true,
		meta: {
			image: true,
			description: true,
		},
	},
	// admin configuration for the cms interface.
	admin: {
		// columns displayed by default in the list view.
		defaultColumns: ["title", "slug", "createdAt", "updatedAt"],
		// configuration for the live preview feature in the admin ui.
		livePreview: {
			// function to generate the url for the live preview iframe.
			url: ({ data, req }) => {
				const path = generatePreviewPath({
					slug: typeof data?.slug === "string" ? data.slug : "",
					collection: "posts",
					req,
				});
				return path;
			},
		},
		// function to generate the url for the regular preview button.
		preview: (data, { req }) =>
			generatePreviewPath({
				slug: typeof data?.slug === "string" ? data.slug : "",
				collection: "posts",
				req,
			}),
		// determines which field to use as the title in the admin breadcrumbs and ui.
		useAsTitle: "title",
	},
	// human-readable labels for the collection in the cms.
	labels: {
		singular: "Post",
		plural: "Posts",
	},
	// field definitions for the 'posts' collection.
	fields: [
		{
			// main title of the blog post, mandatory.
			name: "title",
			type: "text",
			required: true,
		},
		{
			// groups fields into tabs for better organization in the admin ui.
			type: "tabs",
			tabs: [
				{
					// main post content and associated media.
					label: "Content",
					fields: [
						{
							// image used as the main visual for the post, linked to the 'media' collection.
							name: "heroImage",
							type: "upload",
							relationTo: "media",
						},
						{
							// main body of the post using the lexical rich text editor.
							name: "content",
							type: "richText",
							// hides the default label for a cleaner look since it's the main editor.
							label: false,
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
										// allows embedding custom blocks: banner, code, and media.
										BlocksFeature({ blocks: [Banner, Code, Media] }),
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
				},
				{
					// fields for post metadata like related content and categorization.
					label: "Meta",
					fields: [
						{
							// allows relating this post to other posts for a 'read more' section.
							name: "relatedPosts",
							type: "relationship",
							hasMany: true,
							relationTo: "posts",
							admin: {
								// places the field in the admin sidebar.
								position: "sidebar",
							},
							// prevents the post from being related to itself.
							filterOptions: ({ id }) => {
								return {
									id: {
										not_in: [id],
									},
								};
							},
						},
						{
							// categorization for the post, linked to the 'categories' collection.
							name: "categories",
							type: "relationship",
							hasMany: true,
							relationTo: "categories",
							admin: {
								// places the field in the admin sidebar.
								position: "sidebar",
							},
						},
					],
				},
				{
					// fields for search engine optimization (seo).
					name: "meta",
					label: "SEO",
					fields: [
						// provides an overview of the seo settings.
						OverviewField({
							titlePath: "meta.title",
							descriptionPath: "meta.description",
							imagePath: "meta.image",
						}),
						// custom meta title field with an auto-generation option.
						MetaTitleField({
							hasGenerateFn: true,
						}),
						// image for social media sharing cards, linked to the 'media' collection.
						MetaImageField({
							relationTo: "media",
						}),
						// description for search results snippets.
						MetaDescriptionField({}),
						// provides a preview of how the post will look in search results.
						PreviewField({
							hasGenerateFn: true,
							titlePath: "meta.title",
							descriptionPath: "meta.description",
						}),
					],
				},
			],
		},
		// adds a reusable slug field based on the title for clean urls.
		...slugField(),
		{
			// date the post was published, used for sorting and displaying.
			name: "publishedAt",
			type: "date",
			label: "Date Published",
			admin: {
				date: {
					// display only the day.
					pickerAppearance: "dayOnly",
					// format for display in the admin ui.
					displayFormat: "dd mmmm yyyy",
				},
				// places the field in the admin sidebar.
				position: "sidebar",
			},
			hooks: {
				// sets the published date to the current time if the post is set to 'published' status and the date is empty.
				beforeChange: [
					({ siblingData, value }) => {
						if (siblingData._status === "published" && !value) {
							return new Date();
						}
						return value;
					},
				],
			},
		},
		{
			// relationship to the 'users' collection to track the post's authors.
			name: "authors",
			type: "relationship",
			hasMany: true,
			relationTo: "users",
			admin: {
				// places the field in the admin sidebar.
				position: "sidebar",
			},
		},
		{
			// array field used to cache author data after reading for easy client-side access.
			name: "populatedAuthors",
			type: "array",
			access: {
				// prevents any manual updates to this auto-populated field.
				update: () => false,
			},
			admin: {
				// hides and disables the field in the admin ui.
				disabled: true,
				readOnly: true,
			},
			fields: [
				{
					// cached author id.
					name: "id",
					type: "text",
				},
				{
					// cached author name.
					name: "name",
					type: "text",
				},
			],
		},
	],
	hooks: {
		// triggers post revalidation after a change to update the public facing site.
		afterChange: [revalidatePost],
		// populates the 'populatedauthors' field after reading the document.
		afterRead: [populateAuthors],
		// triggers revalidation for a deleted post to remove it from the public site.
		afterDelete: [revalidateDelete],
	},
	// enables and configures the built-in drafts and versions feature.
	versions: {
		// enables the drafts feature.
		drafts: {
			// sets the autosave interval in milliseconds.
			autosave: {
				interval: 100,
			},
			// enables the option to schedule publishing in the future.
			schedulePublish: true,
		},
		// limits the maximum number of versions (revisions) to keep per document.
		maxPerDoc: 50,
	},
};

// export the collection config for use in payload.
export { Posts };
