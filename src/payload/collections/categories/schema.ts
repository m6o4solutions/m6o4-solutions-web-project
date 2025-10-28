import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { slugField } from "@/payload/fields/slug";
import type { CollectionConfig } from "payload";

/**
 * defines the payload collection configuration for 'categories'.
 * this collection manages a taxonomy for grouping other documents, like posts.
 */
const Categories: CollectionConfig = {
	// collection identifier in the database and api
	slug: "categories",
	// access control defines permissions for collection actions.
	access: {
		// only authenticated users can create new categories.
		create: isAuthenticated,
		// only authenticated users can delete categories.
		delete: isAuthenticated,
		// categories are publicly readable to display on the website.
		read: isPublic,
		// only authenticated users can update categories.
		update: isAuthenticated,
	},
	// admin configuration for the cms interface.
	admin: {
		// columns displayed by default in the list view.
		defaultColumns: ["title", "description", "createdAt", "updatedAt"],
		// uses the title field as the primary label in the admin ui.
		useAsTitle: "title",
	},
	// human-readable labels for the collection in the cms.
	labels: {
		singular: "Category",
		plural: "Categories",
	},
	// field definitions for the 'categories' collection.
	fields: [
		{
			// groups 'title' and 'description' fields into a single row for efficient entry.
			type: "row",
			fields: [
				{
					// the name of the category, mandatory.
					name: "title",
					type: "text",
					label: "Title",
					required: true,
					admin: {
						// allocate 20% of the row width to the title field for brevity.
						width: "20%",
					},
				},
				{
					// a short description of the category's purpose or content.
					name: "description",
					type: "text",
					label: "Description",
					admin: {
						// allocate 80% of the row width to the description field.
						width: "80%",
					},
				},
			],
		},
		// adds a reusable slug field based on the title for clean urls (e.g., /category/news).
		...slugField(),
		{
			// field for relevant search terms to aid discovery or internal filtering.
			name: "keywords",
			type: "text",
			label: "Keywords",
		},
	],
};

// export the collection config for use in payload.
export { Categories };
