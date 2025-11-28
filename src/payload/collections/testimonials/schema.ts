import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import {
	revalidateTestimonyChange,
	revalidateTestimonyDelete,
} from "@/payload/collections/testimonials/hooks/revalidate-testimony";
import type { CollectionConfig } from "payload";

/* defines a payload collection for managing client testimonials.
   designed for authenticated content management and public visibility on the site. */
const Testimonials: CollectionConfig = {
	/* unique identifier used by payload's api and database */
	slug: "testimonials",

	/* restricts content management to authenticated users while allowing public reads */
	access: {
		admin: isAuthenticated,
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isPublic,
		update: isAuthenticated,
	},

	/* configures how the collection appears in the payload admin panel */
	admin: {
		defaultColumns: ["name", "job", "rating", "createdAt", "updatedAt"],
		useAsTitle: "name",
	},

	/* defines display names used in the cms interface */
	labels: { singular: "Testimonial", plural: "Testimonials" },

	/* schema definition for testimonial entries */
	fields: [
		{
			/* groups basic identity fields into a single row for better visual balance */
			type: "row",
			fields: [
				{
					/* full name of the testimonial author */
					name: "name",
					type: "text",
					label: "Name",
					required: true,
					admin: { width: "50%" },
				},
				{
					/* professional role or organization associated with the author */
					name: "job",
					type: "text",
					label: "Job Title",
					admin: { width: "50%" },
				},
			],
		},
		{
			/* main testimonial message provided by the client */
			name: "testimonial",
			type: "textarea",
			label: "Testimonial",
			required: true,
		},
		{
			/* rating provided by the client */
			name: "rating",
			type: "number",
			label: "Rating",
			required: true,
			defaultValue: 5,
			min: 1,
			max: 5,
		},
	],
	hooks: {
		afterChange: [revalidateTestimonyChange],
		afterDelete: [revalidateTestimonyDelete],
	},
};

/* exports the collection configuration for payload registration */
export { Testimonials };
