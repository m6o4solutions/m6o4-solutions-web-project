import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { link } from "@/payload/fields/link";
import type { CollectionConfig } from "payload";

/**
 * defines the payload collection configuration for 'cta' (call to action).
 * this collection manages reusable cta components, including title, content, and a single link.
 */
const CTA: CollectionConfig = {
	// collection identifier in the database and api
	slug: "cta",
	// access control defines permissions for collection actions.
	access: {
		// only authenticated users can create new cta items.
		create: isAuthenticated,
		// only authenticated users can delete cta items.
		delete: isAuthenticated,
		// cta items are publicly accessible for website display.
		read: isPublic,
		// only authenticated users can update cta items.
		update: isAuthenticated,
	},
	// admin configuration for the cms interface.
	admin: {
		// columns displayed by default in the list view.
		defaultColumns: ["title", "createdAt", "updatedAt"],
		// determines which field to use as the title in the admin breadcrumbs and ui.
		useAsTitle: "title",
	},
	// human-readable labels for the collection in the cms.
	labels: {
		singular: "CTA",
		plural: "CTAs",
	},
	// field definitions for the 'cta' collection.
	fields: [
		{
			// groups the cta content fields into a single row for efficient entry and display.
			type: "row",
			fields: [
				{
					// the main title of the cta, mandatory.
					name: "title",
					type: "text",
					label: "title",
					required: true,
					admin: {
						// allocate 40% of the row width to the title field.
						width: "40%",
					},
				},
				{
					// the primary content or body text for the cta, mandatory.
					name: "content",
					type: "textarea",
					label: "content",
					required: true,
					admin: {
						// allocate 60% of the row width to the content field.
						width: "60%",
					},
				},
				{
					// an array to hold navigation links, specifically limited to one item.
					name: "navigationItems",
					type: "array",
					label: "navigation items",
					labels: {
						singular: "navigation item",
						plural: "navigation items",
					},
					fields: [
						// imports the reusable link field configuration.
						link({
							// disables the appearance field since the cta will handle styling.
							appearances: false,
						}),
					],
					// limits the array to a single link, as a cta typically has one primary button.
					maxRows: 1,
					admin: {
						components: {
							// uses a custom component to generate a readable label for the row in the admin ui.
							RowLabel: "@/payload/collections/cta/row-label#RowLabel",
						},
						// keeps the array field collapsed by default for a cleaner form.
						initCollapsed: true,
					},
				},
			],
		},
	],
};

// export the collection config for use in payload.
export { CTA };
