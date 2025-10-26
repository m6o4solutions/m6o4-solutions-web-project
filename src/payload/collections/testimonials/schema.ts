import { isAuthenticated } from "@/payload/access/access-control";
import type { CollectionConfig } from "payload";

const Testimonials: CollectionConfig = {
	slug: "testimonials",
	access: {
		admin: isAuthenticated,
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isAuthenticated,
		update: isAuthenticated,
	},
	admin: {
		defaultColumns: ["name", "job", "createdAt", "updatedAt"],
		useAsTitle: "name",
	},
	labels: {
		singular: "Testimonial",
		plural: "Testimonials",
	},
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "name",
					type: "text",
					label: "Name",
					required: true,
					admin: {
						width: "50%",
					},
				},
				{
					name: "job",
					type: "text",
					label: "Job Title",
					admin: {
						width: "50%",
					},
				},
			],
		},
		{
			name: "testimonial",
			type: "textarea",
			label: "Testimonial",
			required: true,
		},
		{
			name: "photo",
			type: "upload",
			relationTo: "media",
			label: "Photo",
			admin: {
				position: "sidebar",
			},
		},
	],
};

export { Testimonials };
