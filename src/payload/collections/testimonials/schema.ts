import { isAuthenticated } from "@/payload/access/access-control";
import type { CollectionConfig } from "payload";

/**
 * defines the payload collection configuration for 'testimonials'.
 * this collection stores client feedback for display on the website.
 */
const Testimonials: CollectionConfig = {
	// collection identifier in the database and api
	slug: "testimonials",
	// access control ensures only authenticated users can manage testimonials.
	access: {
		// determines who can access the admin panel view for this collection.
		admin: isAuthenticated,
		// only authenticated users can create new testimonials.
		create: isAuthenticated,
		// only authenticated users can delete testimonials.
		delete: isAuthenticated,
		// only authenticated users can read testimonials.
		read: isAuthenticated,
		// only authenticated users can update testimonials.
		update: isAuthenticated,
	},
	// admin configuration for the cms interface.
	admin: {
		// columns displayed by default in the list view.
		defaultColumns: ["name", "job", "createdAt", "updatedAt"],
		// determines which field to use as the title in the admin breadcrumbs and ui.
		useAsTitle: "name",
	},
	// human-readable labels for the collection in the cms.
	labels: {
		singular: "Testimonial",
		plural: "Testimonials",
	},
	// field definitions for the 'testimonials' collection.
	fields: [
		{
			// groups 'name' and 'job' fields into a single row for better admin layout.
			type: "row",
			fields: [
				{
					// name of the person giving the testimonial, mandatory.
					name: "name",
					type: "text",
					label: "Name",
					required: true,
					admin: {
						// allocate 50% of the row width to the name field.
						width: "50%",
					},
				},
				{
					// job title or company of the person.
					name: "job",
					type: "text",
					label: "Job Title",
					admin: {
						// allocate 50% of the row width to the job title field.
						width: "50%",
					},
				},
			],
		},
		{
			// the main text of the testimonial, mandatory.
			name: "testimonial",
			type: "textarea",
			label: "Testimonial",
			required: true,
		},
		{
			// optional photo or avatar of the person, linked to the 'media' collection.
			name: "photo",
			type: "upload",
			relationTo: "media",
			label: "Photo",
			admin: {
				// position the field in the admin sidebar.
				position: "sidebar",
			},
		},
	],
};

// export the collection config for use in payload.
export { Testimonials };
