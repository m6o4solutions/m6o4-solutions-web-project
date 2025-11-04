import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { link } from "@/payload/fields/link";
import { slugField } from "@/payload/fields/slug";
import type { CollectionConfig } from "payload";

/* defines the cms schema for managing service offerings, including hero content,
   benefits, features, pricing, and optional saas integrations */
const Services: CollectionConfig = {
	slug: "services",

	/* restricts data modification to authenticated users while keeping read access public */
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isPublic,
		update: isAuthenticated,
	},

	/* configures how this collection appears in the cms dashboard */
	admin: {
		defaultColumns: ["title", "description", "createdAt", "updatedAt"],
		useAsTitle: "title",
	},

	/* defines readable labels for editors in the admin ui */
	labels: {
		singular: "Service",
		plural: "Services",
	},

	fields: [
		/* sets basic metadata describing the service */
		{
			type: "row",
			fields: [
				{
					name: "title",
					type: "text",
					label: "Title",
					required: true,
					admin: { width: "40%" },
				},
				{
					name: "description",
					type: "textarea",
					label: "Description",
					admin: { width: "60%" },
				},
			],
		},

		/* allows flexible control over grid layout for frontend rendering */
		{
			name: "columns",
			type: "select",
			label: "Columns on Large Screens",
			defaultValue: "3",
			options: [
				{ label: "3 Columns", value: "3" },
				{ label: "4 Columns", value: "4" },
			],
		},

		/* generates url-friendly slugs for frontend routing */
		...slugField(),

		/* defines a visual and narrative introduction for each service page */
		{
			name: "hero",
			type: "group",
			label: "Hero Section",
			fields: [
				{ name: "headline", type: "text", label: "Headline", required: true },
				{ name: "subHeadline", type: "textarea", label: "Subheadline" },
				{
					name: "media",
					type: "upload",
					label: "Media",
					required: true,
					relationTo: "media",
				},
			],
		},

		/* describes customer benefits, highlighting business or technical value */
		{
			name: "benefits",
			type: "group",
			label: "Benefits Section",
			fields: [
				{ name: "headline", type: "text", label: "Headline", required: true },
				{ name: "subheadline", type: "text", label: "Subheadline" },
				{
					name: "serviceBenefits",
					type: "array",
					label: "Service Benefits",
					labels: { singular: "Service Benefit", plural: "Service Benefits" },
					fields: [
						{
							name: "benefitSymbol",
							type: "group",
							label: "Benefit Symbol",
							fields: [
								/* lets editors choose between icon or text display for visual variety */
								{
									name: "type",
									type: "select",
									label: "Type",
									defaultValue: "icon",
									options: [
										{ label: "Icon", value: "icon" },
										{ label: "Text", value: "text" },
									],
								},
								{
									name: "text",
									type: "text",
									label: "Text",
									admin: {
										condition: (_, siblingData) => siblingData?.type === "text",
									},
								},
								{
									name: "icon",
									type: "select",
									label: "Icon",
									admin: {
										condition: (_, siblingData) => siblingData?.type === "icon",
									},
									options: [
										{ label: "Ban", value: "ban" },
										{ label: "Brain", value: "brain" },
										{ label: "Check", value: "check" },
										{ label: "Chevrons Down", value: "chevronsDown" },
										{ label: "Chevrons Up", value: "chevronsUp" },
										{ label: "Cloud", value: "cloud" },
										{ label: "CPU", value: "cpu" },
										{ label: "Dollar Sign", value: "dollarSign" },
										{ label: "Globe", value: "globe" },
										{ label: "Search", value: "search" },
										{ label: "Shield", value: "shield" },
										{ label: "Trending Down", value: "trendingDown" },
										{ label: "Trending Up", value: "trendingUp" },
										{ label: "Zap", value: "zap" },
									],
								},
							],
						},
						{ name: "benefitTitle", type: "text", label: "Benefit Title" },
						{ name: "benefitDescription", type: "textarea", label: "Benefit Description" },
					],
					maxRows: 6,
					admin: { initCollapsed: true },
				},
			],
		},

		/* enumerates technical or operational aspects that support the service */
		{
			name: "features",
			type: "group",
			label: "Features Section",
			fields: [
				{ name: "headline", type: "text", label: "Headline", required: true },
				{ name: "subheadline", type: "text", label: "Subheadline" },
				{
					name: "serviceFeatures",
					type: "array",
					label: "Service Features",
					labels: { singular: "Service Feature", plural: "Service Features" },
					fields: [
						{ name: "featureTitle", type: "text", label: "Feature Title" },
						{ name: "featureDescription", type: "textarea", label: "Feature Description" },
						{ name: "featureImage", type: "upload", label: "Feature Image", relationTo: "media" },
					],
					maxRows: 6,
					admin: { initCollapsed: true },
				},
			],
		},

		/* structures pricing details and optional recurring payment configurations */
		{
			name: "pricing",
			type: "group",
			label: "Pricing Section",
			fields: [
				{ name: "headline", type: "text", label: "Headline", required: true },
				{ name: "subheadline", type: "text", label: "Subheadline" },
				{
					name: "servicePricing",
					type: "array",
					label: "Service Pricing",
					labels: { singular: "Service Price", plural: "Service Prices" },
					fields: [
						{ name: "priceTitle", type: "text", label: "Price Title", required: true },
						{ name: "priceDescription", type: "text", label: "Price Description" },
						{ name: "price", type: "number", label: "Price", required: true, min: 0.0 },
						{
							name: "popularSubscription",
							type: "checkbox",
							label: "Popular subscription?",
							defaultValue: false,
						},
						{
							name: "enableSubscription",
							type: "checkbox",
							label: "Enable subscription?",
							defaultValue: false,
						},
						/* reveals recurring cost input when subscription mode is active */
						{
							name: "subscriptionPrice",
							type: "number",
							label: "Subscription Price",
							min: 0.0,
							admin: {
								condition: (_, siblingData) => siblingData?.enableSubscription === true,
							},
						},
						/* outlines included perks for pricing transparency */
						{
							name: "perks",
							type: "array",
							label: "Perks",
							labels: { singular: "Perk", plural: "Perks" },
							fields: [{ name: "perk", type: "text", label: "Perk" }],
							maxRows: 8,
							admin: { initCollapsed: true },
						},
						/* supports optional cta buttons for conversions */
						{
							name: "cta",
							type: "array",
							label: "Call to Action",
							labels: {
								singular: "Call to Action",
								plural: "Calls to Action",
							},
							fields: [link({ appearances: false })],
							maxRows: 1,
							admin: {
								components: {
									RowLabel: "@/payload/collections/services/row-label#RowLabel",
								},
								initCollapsed: true,
							},
						},
					],
					maxRows: 3,
					admin: { initCollapsed: true },
				},
			],
		},

		/* toggles inclusion of saas-related content for integrated offerings */
		{
			name: "enableSaaS",
			type: "checkbox",
			label: "Enable SaaS solutions?",
			defaultValue: false,
		},

		/* defines saas products or integrations associated with the service */
		{
			name: "saas",
			type: "group",
			label: "SaaS Solutions",
			admin: {
				condition: (_, siblingData) => siblingData?.enableSaaS === true,
			},
			fields: [
				{ name: "headline", type: "text", label: "Headline" },
				{ name: "subheadline", type: "text", label: "Subheadline" },
				{
					name: "saasDetails",
					type: "array",
					label: "SaaS Details",
					labels: { singular: "SaaS Detail", plural: "SaaS Details" },
					fields: [
						{ name: "saasName", type: "text", label: "SaaS Name" },
						{ name: "saasDescription", type: "textarea", label: "SaaS Description" },
						{ name: "saasImage", type: "upload", label: "SaaS Image", relationTo: "media" },
						{ name: "saasLink", type: "text", label: "Link to SaaS Landing Page" },
					],
					maxRows: 3,
					admin: { initCollapsed: true },
				},
			],
		},
	],
};

/* exported for inclusion in the main payload config */
export { Services };
