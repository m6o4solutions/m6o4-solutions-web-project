import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { link } from "@/payload/fields/link";
import { slugField } from "@/payload/fields/slug";
import type { CollectionConfig } from "payload";

/**
 * defines the payload collection configuration for 'services'.
 * this collection is used to detail individual service offerings, their features, and pricing.
 */
const Services: CollectionConfig = {
	// collection identifier in the database and api
	slug: "services",
	// access control defines permissions for collection actions.
	access: {
		// only authenticated users can create new services.
		create: isAuthenticated,
		// only authenticated users can delete services.
		delete: isAuthenticated,
		// all users, public and authenticated, can read service details.
		read: isPublic,
		// only authenticated users can update existing services.
		update: isAuthenticated,
	},
	// admin configuration for the cms interface.
	admin: {
		// columns displayed by default in the list view.
		defaultColumns: ["title", "description", "createdAt", "updatedAt"],
		// determines which field to use as the title in the admin breadcrumbs and ui.
		useAsTitle: "title",
	},
	// human-readable labels for the collection in the cms.
	labels: {
		singular: "Service",
		plural: "Services",
	},
	// field definitions for the 'services' collection.
	fields: [
		{
			// groups 'title' and 'description' fields into a single row for a concise overview.
			type: "row",
			fields: [
				{
					// main title of the service, mandatory.
					name: "title",
					type: "text",
					label: "Title",
					required: true,
					admin: {
						// allocate 40% of the row width to the title field.
						width: "40%",
					},
				},
				{
					// brief description of the service.
					name: "description",
					type: "text",
					label: "Description",
					admin: {
						// allocate 60% of the row width to the description field.
						width: "60%",
					},
				},
			],
		},
		// adds a reusable slug field based on the title for clean urls.
		...slugField(),
		{
			// groups fields related to the benefits section of the service detail page.
			name: "benefits",
			type: "group",
			label: "Benefits",
			fields: [
				{
					// heading for the benefits section.
					name: "title",
					type: "text",
					label: "Title",
					required: true,
				},
				{
					// subheading for the benefits section.
					name: "subtitle",
					type: "text",
					label: "Subtitle",
					required: true,
				},
				{
					// list of specific benefits the service provides.
					name: "serviceBenefits",
					type: "array",
					label: "Service Benefits",
					labels: {
						singular: "Service Benefit",
						plural: "Service Benefits",
					},
					fields: [
						{
							// title of an individual benefit point.
							name: "benefitTitle",
							type: "text",
							label: "Benefit Title",
							required: true,
						},
						{
							// detailed explanation of the benefit.
							name: "benefitDescription",
							type: "textarea",
							label: "Benefit Description",
							required: true,
						},
					],
					// limits the array to a maximum of six benefit items.
					maxRows: 6,
					admin: {
						// keeps the array section collapsed by default for a cleaner admin view.
						initCollapsed: true,
					},
				},
			],
		},
		{
			// groups fields related to the features section of the service detail page.
			name: "features",
			type: "group",
			label: "Features",
			fields: [
				{
					// heading for the features section.
					name: "title",
					type: "text",
					label: "Title",
					required: true,
				},
				{
					// subheading for the features section.
					name: "subtitle",
					type: "text",
					label: "Subtitle",
					required: true,
				},
				{
					// list of specific features included in the service.
					name: "serviceFeatures",
					type: "array",
					label: "Service Features",
					labels: {
						singular: "Service Feature",
						plural: "Service Features",
					},
					fields: [
						{
							// title of an individual feature.
							name: "featureTitle",
							type: "text",
							label: "Feature Title",
							required: true,
						},
						{
							// detailed description of the feature.
							name: "featureDescription",
							type: "textarea",
							label: "Feature Description",
							required: true,
						},
						{
							// optional image to visually represent the feature.
							name: "featureImage",
							type: "upload",
							label: "Feature Image",
							relationTo: "media",
						},
					],
					// limits the array to a maximum of six feature items.
					maxRows: 6,
					admin: {
						// keeps the array section collapsed by default for a cleaner admin view.
						initCollapsed: true,
					},
				},
			],
		},
		{
			// groups fields related to the pricing options for the service.
			name: "pricing",
			type: "group",
			label: "Pricing",
			fields: [
				{
					// heading for the pricing section.
					name: "title",
					type: "text",
					label: "Title",
					required: true,
				},
				{
					// subheading for the pricing section.
					name: "subtitle",
					type: "text",
					label: "Subtitle",
					required: true,
				},
				{
					// array for multiple pricing tiers or plans for the service.
					name: "servicePricing",
					type: "array",
					label: "Service Pricing",
					labels: {
						singular: "Service Price",
						plural: "Service Prices",
					},
					fields: [
						{
							// name of the pricing plan (e.g., "basic", "premium").
							name: "priceTitle",
							type: "text",
							label: "Price Title",
							required: true,
						},
						{
							// short summary or tagline for the price plan.
							name: "priceDescription",
							type: "text",
							label: "Price Description",
						},
						{
							// the standard one-time or upfront price.
							name: "price",
							type: "number",
							label: "Price",
							required: true,
							min: 0.0,
						},
						{
							// toggle to enable a separate subscription pricing option.
							name: "enableSubscription",
							type: "checkbox",
							label: "Enable Subscription",
							defaultValue: false,
						},
						{
							// the recurring subscription price.
							name: "subscriptionPrice",
							type: "number",
							label: "Subscription Price",
							min: 0.0,
							admin: {
								// only shows this field if 'enableSubscription' is checked.
								condition: (_, siblingData) => siblingData?.enableSubscription === true,
							},
						},
						{
							// list of benefits or 'perks' included in this price plan.
							name: "perks",
							type: "array",
							label: "Perks",
							labels: {
								singular: "Perk",
								plural: "Perks",
							},
							fields: [
								{
									// a single perk or feature included in the plan.
									name: "perk",
									type: "text",
									label: "Perk",
								},
							],
							// limits the perks list to a maximum of eight entries.
							maxRows: 8,
							admin: {
								// keeps the perks list collapsed by default.
								initCollapsed: true,
							},
						},
					],
					// limits the number of pricing plans to a maximum of three.
					maxRows: 3,
					admin: {
						// keeps the pricing array collapsed by default for a cleaner admin view.
						initCollapsed: true,
					},
				},
			],
		},
		{
			// array for call-to-action buttons associated with the service.
			name: "ctaItems",
			type: "array",
			label: "Call to Action",
			labels: {
				singular: "Call to Action Item",
				plural: "Call to Action Items",
			},
			fields: [
				// reuses a common link field configuration without appearance options.
				link({
					appearances: false,
				}),
			],
			// limits the number of cta items to one.
			maxRows: 1,
			admin: {
				components: {
					// utilizes a custom react component for the row label in the admin ui.
					RowLabel: "@/payload/collections/services/row-label#RowLabel",
				},
				// keeps the cta section collapsed by default.
				initCollapsed: true,
			},
		},
	],
};

// export the collection config for use in payload.
export { Services };
