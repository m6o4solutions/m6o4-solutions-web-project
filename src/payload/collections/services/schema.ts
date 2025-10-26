import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { slugField } from "@/payload/fields/slug";
import type { CollectionConfig } from "payload";

const Services: CollectionConfig = {
	slug: "services",
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
		singular: "Service",
		plural: "Services",
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
					name: "description",
					type: "text",
					label: "Description",
					admin: {
						width: "60%",
					},
				},
			],
		},
		...slugField(),
		{
			name: "benefits",
			type: "array",
			label: "Service Benefits",
			labels: {
				singular: "Benefit",
				plural: "Benefits",
			},
			fields: [
				{
					name: "benefitTitle",
					type: "text",
					label: "Benefit Title",
					required: true,
				},
				{
					name: "benefitDescription",
					type: "textarea",
					label: "Benefit Description",
					required: true,
				},
			],
			maxRows: 6,
			admin: {
				initCollapsed: true,
			},
		},
		{
			name: "features",
			type: "array",
			label: "Service Features",
			labels: {
				singular: "Feature",
				plural: "Features",
			},
			fields: [
				{
					name: "featureTitle",
					type: "text",
					label: "Feature Title",
					required: true,
				},
				{
					name: "featureDescription",
					type: "textarea",
					label: "Feature Description",
					required: true,
				},
				{
					name: "featureImage",
					type: "upload",
					label: "Feature Image",
					relationTo: "media",
				},
			],
			maxRows: 6,
			admin: {
				initCollapsed: true,
			},
		},
	],
};

export { Services };
