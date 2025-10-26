import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { link } from "@/payload/fields/link";
import type { CollectionConfig } from "payload";

const CTA: CollectionConfig = {
	slug: "cta",
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isPublic,
		update: isAuthenticated,
	},
	admin: {
		defaultColumns: ["title", "createdAt", "updatedAt"],
		useAsTitle: "title",
	},
	labels: {
		singular: "CTA",
		plural: "CTAs",
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
						width: "40%",
					},
				},
				{
					name: "content",
					type: "textarea",
					label: "Content",
					required: true,
					admin: {
						width: "60%",
					},
				},
				{
					name: "navigationItems",
					type: "array",
					label: "Navigation Items",
					labels: {
						singular: "Navigation Item",
						plural: "Navigation Items",
					},
					fields: [
						link({
							appearances: false,
						}),
					],
					maxRows: 1,
					admin: {
						components: {
							RowLabel: "@/payload/collections/cta/row-label#RowLabel",
						},
						initCollapsed: true,
					},
				},
			],
		},
	],
};

export { CTA };
