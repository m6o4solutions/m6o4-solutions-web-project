import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import type { CollectionConfig } from "payload";

/* defines a collection for managing company logos.
   limits write access to authenticated users while keeping read access public.
   intended for use in areas such as client showcases or partner sections. */
const Logos: CollectionConfig = {
	slug: "logos",

	// enforces granular access control for content safety and editorial workflow
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isPublic,
		update: isAuthenticated,
	},

	// configures admin panel appearance for better usability
	admin: {
		defaultColumns: ["company", "logo", "createdAt", "updatedAt"],
		useAsTitle: "company",
	},

	// defines how the collection is labeled throughout the system
	labels: {
		singular: "Logo",
		plural: "Logos",
	},

	// describes data structure and field relationships
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "company",
					type: "text",
					label: "Company",
					required: true,
					admin: {
						width: "50%",
					},
				},
				{
					name: "logo",
					type: "upload",
					label: "Logo",
					relationTo: "media",
					required: true,
					admin: {
						width: "50%",
					},
				},
			],
		},
	],
};

export { Logos };
