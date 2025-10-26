import type { Field } from "payload";

/**
 * defines the custom fields used to store document metadata within the payload search index.
 */
const searchFields: Field[] = [
	{
		name: "slug",
		type: "text",
		index: true,
		admin: {
			readOnly: true,
		},
	},
	{
		name: "meta",
		label: "Meta",
		type: "group",
		index: true,
		admin: {
			readOnly: true,
		},
		fields: [
			{
				type: "text",
				name: "title",
				label: "Title",
			},
			{
				type: "text",
				name: "description",
				label: "Description",
			},
			{
				name: "image",
				label: "Image",
				type: "upload",
				relationTo: "media",
			},
		],
	},
	{
		label: "Categories",
		name: "categories",
		type: "array",
		admin: {
			readOnly: true,
		},
		fields: [
			{
				name: "relationTo",
				type: "text",
			},
			{
				name: "categoryID",
				type: "text",
			},
			{
				name: "title",
				type: "text",
			},
		],
	},
];

export { searchFields };
