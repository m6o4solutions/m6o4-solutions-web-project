import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { slugField } from "@/payload/fields/slug";
import type { CollectionConfig } from "payload";

const Categories: CollectionConfig = {
	slug: "categories",
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isPublic,
		update: isAuthenticated,
	},
	admin: {
		defaultColumns: ["title", "description", "createdAt", "updatedAt"],
		useAsTitle: "title",
	},
	labels: {
		singular: "Category",
		plural: "Categories",
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
						width: "20%",
					},
				},
				{
					name: "description",
					type: "text",
					label: "Description",
					admin: {
						width: "80%",
					},
				},
			],
		},
		...slugField(),
		{
			name: "keywords",
			type: "text",
			label: "Keywords",
		},
	],
};

export { Categories };
