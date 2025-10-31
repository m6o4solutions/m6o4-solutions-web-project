import { isAuthenticated, isAuthenticatedOrPublished } from "@/payload/access/access-control";
import { Archive } from "@/payload/blocks/archive/schema";
import { CallToAction } from "@/payload/blocks/call-to-action/schema";
import { ContentCards } from "@/payload/blocks/content-cards/schema";
import { ContentCopy } from "@/payload/blocks/content-copy/schema";
import { HeroPrimary } from "@/payload/blocks/hero-primary/schema";
import { HeroSecondary } from "@/payload/blocks/hero-secondary/schema";
import { revalidateDelete, revalidatePage } from "@/payload/collections/pages/hooks/revalidate-page";
import { slugField } from "@/payload/fields/slug";
import { populatePublishedAt } from "@/payload/hooks/populate-published-at";
import { generatePreviewPath } from "@/payload/utilities/generate-preview-path";
import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { CollectionConfig } from "payload";

/**
 * defines the payload collection configuration for 'pages'.
 * this collection manages the structure, access control, and behavior of website pages.
 */
const Pages: CollectionConfig<"pages"> = {
	// collection identifier in the database and api
	slug: "pages",
	// access control defines permissions for collection actions.
	access: {
		// only authenticated users can create new pages.
		create: isAuthenticated,
		// only authenticated users can delete pages.
		delete: isAuthenticated,
		// public can read only if the page is explicitly published; otherwise, only authenticated can read.
		read: isAuthenticatedOrPublished,
		// only authenticated users can update existing pages.
		update: isAuthenticated,
	},
	// defines fields that are automatically populated when this page is referenced.
	defaultPopulate: {
		title: true,
		slug: true,
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
					collection: "pages",
					req,
				});

				return path;
			},
		},
		// function to generate the url for the regular preview button.
		preview: (data, { req }) =>
			generatePreviewPath({
				slug: typeof data?.slug === "string" ? data.slug : "",
				collection: "pages",
				req,
			}),
		// determines which field to use as the title in the admin breadcrumbs and ui.
		useAsTitle: "title",
	},
	// human-readable labels for the collection in the cms.
	labels: {
		singular: "Page",
		plural: "Pages",
	},
	// field definitions for the 'pages' collection.
	fields: [
		{
			// main title of the page, mandatory.
			name: "title",
			type: "text",
			label: "Title",
			required: true,
		},
		{
			// groups fields into tabs for better organization in the admin ui.
			type: "tabs",
			tabs: [
				{
					// tab for page content, primarily managed via a blocks field.
					label: "Content",
					fields: [
						{
							// flexible content layout built with reusable blocks.
							name: "layout",
							type: "blocks",
							admin: {
								// keeps the blocks section collapsed by default for a cleaner interface.
								initCollapsed: true,
							},
							// specifies which blocks are available for use on a page.
							blocks: [Archive, HeroPrimary, HeroSecondary, ContentCopy, ContentCards, CallToAction],
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
						// provides a preview of how the page will look in search results.
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
			// date the page was published, used for sorting, display, and hook logic.
			name: "publishedAt",
			type: "date",
			label: "Date Published",
			admin: {
				date: {
					// display only the day.
					pickerAppearance: "dayOnly",
					// format for display in the admin ui.
					displayFormat: "d MMM yyy",
				},
				// places the field in the admin sidebar.
				position: "sidebar",
			},
		},
	],
	hooks: {
		// triggers page revalidation after a change to update the public facing site.
		afterChange: [revalidatePage],
		// automatically sets the published date if status changes to 'published' and the date is empty.
		beforeChange: [populatePublishedAt],
		// triggers revalidation for a deleted page to remove it from the public site.
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
export { Pages };
