import { isAuthenticated } from "@/payload/access/access-control";
import type { CollectionConfig, FieldHook } from "payload";

/**
 * combines the firstName and lastName fields to generate the full name.
 * this field hook runs before validation to populate the 'name' field automatically.
 */
const populateFullName: FieldHook = async ({ data }) => {
	return `${data?.firstName} ${data?.lastName}`;
};

/**
 * defines the payload collection configuration for 'users'.
 * this collection manages all authenticated users and their related data.
 */
const Users: CollectionConfig = {
	// collection identifier in the database and api
	slug: "users",
	// access control ensures only authenticated users can manage user data.
	access: {
		// determines who can access the admin panel view for this collection.
		admin: isAuthenticated,
		// only authenticated users can create new users.
		create: isAuthenticated,
		// only authenticated users can delete users.
		delete: isAuthenticated,
		// only authenticated users can read users.
		read: isAuthenticated,
		// only authenticated users can update users.
		update: isAuthenticated,
	},
	// admin configuration for the cms interface.
	admin: {
		// columns displayed by default in the list view.
		defaultColumns: ["name", "photo", "email", "createdAt", "updatedAt"],
		// determines which field to use as the title in the admin breadcrumbs and ui.
		useAsTitle: "name",
	},
	// human-readable labels for the collection in the cms.
	labels: {
		singular: "User",
		plural: "Users",
	},
	// enables payload's built-in authentication features for this collection.
	auth: true,
	// field definitions for the 'users' collection.
	fields: [
		{
			// groups 'firstName' and 'lastName' fields into a single row for better admin layout.
			type: "row",
			fields: [
				{
					// first name of the user, mandatory for identification.
					name: "firstName",
					type: "text",
					label: "First Name",
					required: true,
					admin: {
						// allocate 50% of the row width to the first name field.
						width: "50%",
					},
				},
				{
					// last name of the user, mandatory for identification.
					name: "lastName",
					type: "text",
					label: "Last Name",
					required: true,
					admin: {
						// allocate 50% of the row width to the last name field.
						width: "50%",
					},
				},
			],
		},
		{
			// calculated field for the user's full name, used for display purposes.
			name: "name",
			type: "text",
			label: "Name",
			admin: {
				// position the field in the admin sidebar.
				position: "sidebar",
				// prevents the field from being visible in the admin ui since it's auto-generated.
				hidden: true,
				// ensures the value cannot be manually changed by an admin.
				readOnly: true,
			},
			hooks: {
				// automatically populates the full name before validation.
				beforeValidate: [populateFullName],
			},
		},
		{
			// user's profile photo, linked to the 'media' collection.
			name: "photo",
			type: "upload",
			label: "Photo",
			relationTo: "media",
			admin: {
				// position the field in the admin sidebar.
				position: "sidebar",
			},
		},
	],
};

// export the collection config for use in payload.
export { Users };
