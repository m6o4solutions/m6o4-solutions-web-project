import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { link } from "@/payload/fields/link";
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
			type: "group",
			label: "Benefits",
			fields: [
				{
					name: "title",
					type: "text",
					label: "Title",
					required: true,
				},
				{
					name: "subtitle",
					type: "text",
					label: "Subtitle",
					required: true,
				},
				{
					name: "serviceBenefits",
					type: "array",
					label: "Service Benefits",
					labels: {
						singular: "Service Benefit",
						plural: "Service Benefits",
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
			],
		},
		{
			name: "features",
			type: "group",
			label: "Features",
			fields: [
				{
					name: "title",
					type: "text",
					label: "Title",
					required: true,
				},
				{
					name: "subtitle",
					type: "text",
					label: "Subtitle",
					required: true,
				},
				{
					name: "serviceFeatures",
					type: "array",
					label: "Service Features",
					labels: {
						singular: "Service Feature",
						plural: "Service Features",
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
		},
		{
			name: "pricing",
			type: "group",
			label: "Pricing",
			fields: [
				{
					name: "title",
					type: "text",
					label: "Title",
					required: true,
				},
				{
					name: "subtitle",
					type: "text",
					label: "Subtitle",
					required: true,
				},
				{
					name: "servicePricing",
					type: "array",
					label: "Service Pricing",
					labels: {
						singular: "Service Price",
						plural: "Service Prices",
					},
					fields: [
						{
							name: "priceTitle",
							type: "text",
							label: "Price Title",
							required: true,
						},
						{
							name: "priceDescription",
							type: "text",
							label: "Price Description",
						},
						{
							name: "price",
							type: "number",
							label: "Price",
							required: true,
							min: 0.0,
						},
						{
							name: "enableSubscription",
							type: "checkbox",
							label: "Enable Subscription",
							defaultValue: false,
						},
						{
							name: "subscriptionPrice",
							type: "number",
							label: "Subscription Price",
							min: 0.0,
							admin: {
								condition: (_, siblingData) => siblingData?.enableSubscription === true,
							},
						},
						{
							name: "perks",
							type: "array",
							label: "Perks",
							labels: {
								singular: "Perk",
								plural: "Perks",
							},
							fields: [
								{
									name: "perk",
									type: "text",
									label: "Perk",
								},
							],
							maxRows: 8,
							admin: {
								initCollapsed: true,
							},
						},
					],
					maxRows: 3,
					admin: {
						initCollapsed: true,
					},
				},
			],
		},
		{
			name: "ctaItems",
			type: "array",
			label: "Call to Action",
			labels: {
				singular: "Call to Action Item",
				plural: "Call to Action Items",
			},
			fields: [
				link({
					appearances: false,
				}),
			],
			maxRows: 1,
			admin: {
				components: {
					RowLabel: "@/payload/collections/services/row-label#RowLabel",
				},
				initCollapsed: true,
			},
		},
	],
};

export { Services };
