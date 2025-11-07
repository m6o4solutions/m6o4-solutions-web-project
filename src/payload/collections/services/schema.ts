import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { link } from "@/payload/fields/link";
import { slugField } from "@/payload/fields/slug";
import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { CollectionConfig } from "payload";

/* defines the core structure for managing service offerings, their presentation, 
   and related metadata across both ui and seo contexts */
const Services: CollectionConfig = {
	slug: "services",

	/* restricts content modification to authenticated users while allowing public read access */
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isPublic,
		update: isAuthenticated,
	},

	/* configures admin behavior for easier navigation and display consistency */
	admin: {
		defaultColumns: ["title", "createdAt", "updatedAt"],
		useAsTitle: "title",
	},

	labels: {
		singular: "Service",
		plural: "Services",
	},

	fields: [
		/* primary service identifier */
		{
			name: "title",
			type: "text",
			label: "Title",
			required: true,
		},

		/* groups content and seo management into distinct editing tabs */
		{
			type: "tabs",
			tabs: [
				{
					label: "Content",
					fields: [
						/* hero section for high-level branding and visual entry point */
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

						/* benefit section to highlight key value propositions */
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
												/* allows visual or textual icons for flexible presentation */
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
												/* shows text option only when relevant */
												{
													name: "text",
													type: "text",
													label: "Text",
													admin: {
														condition: (_, siblingData) => siblingData?.type === "text",
													},
												},
												/* shows icon option only when relevant */
												{
													name: "icon",
													type: "select",
													label: "Icon",
													admin: {
														condition: (_, siblingData) => siblingData?.type === "icon",
													},
													options: [
														{ label: "Award", value: "award" },
														{ label: "Ban", value: "ban" },
														{ label: "Brain", value: "brain" },
														{ label: "Check", value: "check" },
														{ label: "Chevrons Down", value: "chevronsDown" },
														{ label: "Chevrons Up", value: "chevronsUp" },
														{ label: "Clock", value: "clock" },
														{ label: "Cloud", value: "cloud" },
														{ label: "CPU", value: "cpu" },
														{ label: "Dollar Sign", value: "dollarSign" },
														{ label: "Globe", value: "globe" },
														{ label: "Handshake", value: "handshake" },
														{ label: "Lightbulb", value: "lightbulb" },
														{ label: "Search", value: "search" },
														{ label: "Shield", value: "shield" },
														{ label: "Trending Down", value: "trendingDown" },
														{ label: "Trending Up", value: "trendingUp" },
														{ label: "Users", value: "users" },
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

						/* feature section for outlining capabilities and differentiators */
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

						/* toggles pricing visibility for traditional service offerings */
						{
							name: "enablePricing",
							type: "checkbox",
							label: "Enable Pricing Tables?",
							defaultValue: true,
							admin: {
								condition: (_, siblingData) => siblingData?.enableSaaS !== true,
							},
						},

						/* pricing configuration supporting tiered or subscription-based models */
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
										{ name: "price", type: "text", label: "Price", required: true },
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
										/* conditionally exposes recurring pricing for subscription services */
										{
											name: "subscriptionPrice",
											type: "text",
											label: "Subscription Price",
											admin: {
												condition: (_, siblingData) => siblingData?.enableSubscription === true,
											},
										},
										/* highlights included features per pricing tier */
										{
											name: "perks",
											type: "array",
											label: "Perks",
											labels: { singular: "Perk", plural: "Perks" },
											fields: [{ name: "perk", type: "text", label: "Perk" }],
											maxRows: 8,
											admin: { initCollapsed: true },
										},
										/* adds targeted conversion links for pricing plans */
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
							admin: {
								condition: (_, siblingData) => siblingData?.enablePricing === true && siblingData?.enableSaaS !== true,
							},
						},

						/* toggles between pricing models and saas integration modes */
						{
							name: "enableSaaS",
							type: "checkbox",
							label: "Enable SaaS Solutions?",
							defaultValue: false,
							admin: {
								condition: (_, siblingData) => siblingData?.enablePricing !== true,
							},
						},

						/* defines integration details for software-based service extensions */
						{
							name: "saas",
							type: "group",
							label: "SaaS Solutions",
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
							admin: {
								condition: (_, siblingData) => siblingData?.enableSaaS === true && siblingData?.enablePricing !== true,
							},
						},
					],
				},

				/* seo tab centralizing structured metadata for search optimization */
				{
					name: "meta",
					label: "SEO",
					fields: [
						OverviewField({
							titlePath: "meta.title",
							descriptionPath: "meta.description",
							imagePath: "meta.image",
						}),
						MetaTitleField({ hasGenerateFn: true }),
						MetaImageField({ relationTo: "media" }),
						MetaDescriptionField({}),
						PreviewField({
							hasGenerateFn: true,
							titlePath: "meta.title",
							descriptionPath: "meta.description",
						}),
					],
				},
			],
		},

		/* auto-generates slugs for clean, predictable urls */
		...slugField(),
	],
};

/* exported for use in the main payload configuration */
export { Services };
