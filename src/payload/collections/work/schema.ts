import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { slugField } from "@/payload/fields/slug";
import type { CollectionConfig } from "payload";

/* defines the structure and behavior of the 'work' collection used to showcase past client projects or case studies */
const Work: CollectionConfig = {
	slug: "work",

	/* restricts write operations to authenticated users while allowing public read access */
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isPublic,
		update: isAuthenticated,
	},

	/* configures how the collection appears within the cms admin interface */
	admin: {
		defaultColumns: ["title", "industry", "createdAt", "updatedAt"],
		useAsTitle: "title",
	},

	/* defines human-friendly naming for the cms interface */
	labels: { singular: "Work", plural: "Work" },

	fields: [
		{
			/* organizes the main identifying information into a single row for clarity */
			type: "row",
			fields: [
				{
					name: "title",
					type: "text",
					label: "Title",
					required: true,
					admin: { width: "60%" },
				},
				{
					name: "industry",
					type: "text",
					label: "Industry",
					admin: { width: "40%" },
				},
			],
		},
		{
			/* groups service type and conditional link for cleaner data entry */
			type: "row",
			fields: [
				{
					name: "service",
					type: "select",
					label: "Service",
					defaultValue: "ctoaas",
					options: [
						{ label: "Website as a Service", value: "waas" },
						{ label: "Chief Technology Officer as a Service", value: "ctoaas" },
					],
					required: true,
					admin: { width: "50%" },
				},
				{
					name: "solutionLink",
					type: "text",
					label: "Solution Link",
					/* link field is only relevant when the service type is 'waas' */
					admin: {
						condition: (data, siblingData) => data.service === "waas",
						width: "50%",
					},
				},
			],
		},
		{
			/* outlines the problem the client faced */
			name: "challenge",
			type: "textarea",
			label: "Challenge",
			required: true,
		},
		{
			/* details how the team addressed the problem */
			name: "solution",
			type: "textarea",
			label: "Solution",
			required: true,
		},
		{
			/* captures measurable or qualitative outcomes from the project */
			name: "results",
			type: "array",
			label: "Results",
			labels: { singular: "Result", plural: "Results" },
			fields: [
				{
					name: "result",
					type: "text",
					label: "Result",
				},
			],
			maxRows: 5,
			admin: { initCollapsed: true },
		},
		/* automatically generates a unique slug based on the title for routing or URLs */
		...slugField(),
		{
			/* associates a visual reference or project thumbnail */
			name: "image",
			type: "upload",
			relationTo: "media",
			required: true,
			admin: { position: "sidebar" },
		},
	],
};

/* exports the configured collection for registration in the payload cms setup */
export { Work };
