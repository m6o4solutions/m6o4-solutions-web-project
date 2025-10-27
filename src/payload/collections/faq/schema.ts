import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import type { CollectionConfig } from "payload";

/**
 * defines the payload collection configuration for 'faq' (frequently asked questions).
 * this collection stores question-and-answer pairs for public display.
 */
const FAQ: CollectionConfig = {
	// collection identifier in the database and api
	slug: "faq",
	// access control defines permissions for collection actions.
	access: {
		// only authenticated users can create new faq items.
		create: isAuthenticated,
		// only authenticated users can delete faq items.
		delete: isAuthenticated,
		// faq items are publicly accessible for website display.
		read: isPublic,
		// only authenticated users can update faq items.
		update: isAuthenticated,
	},
	// admin configuration for the cms interface.
	admin: {
		// columns displayed by default in the list view.
		defaultColumns: ["question", "createdAt", "updatedAt"],
		// determines which field to use as the title in the admin breadcrumbs and ui.
		useAsTitle: "question",
	},
	// human-readable labels for the collection in the cms.
	labels: {
		singular: "FAQ",
		plural: "FAQs",
	},
	// field definitions for the 'faq' collection.
	fields: [
		{
			// groups 'question' and 'answer' fields into a single row for efficient entry and display.
			type: "row",
			fields: [
				{
					// the question text, mandatory.
					name: "question",
					type: "text",
					label: "question",
					required: true,
					admin: {
						// allocate 40% of the row width to the question field.
						width: "40%",
					},
				},
				{
					// the answer text, mandatory, using a larger textarea for detailed responses.
					name: "answer",
					type: "textarea",
					label: "answer",
					required: true,
					admin: {
						// allocate 60% of the row width to the answer field.
						width: "60%",
					},
				},
			],
		},
	],
};

// export the collection config for use in payload.
export { FAQ };
