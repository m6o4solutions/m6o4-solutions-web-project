import type { Block } from "payload";

// defines a structured block for displaying a section of services or features using a card grid.
const ContentCardServices: Block = {
	slug: "contentCardServices",
	interfaceName: "ContentCardServices",
	labels: {
		singular: "Content Cards Services Block",
		plural: "Content Cards Services Blocks",
	},
	fields: [
		{
			name: "headline",
			type: "text",
			label: "Headline",
			required: true, // ensures the section always has a main title for context.
		},
		{
			name: "subheadline",
			type: "text",
			label: "Subheadline", // optional supporting text for the section header.
		},
		{
			name: "gridCards",
			type: "array",
			label: "Cards",
			labels: {
				singular: "Card",
				plural: "Cards",
			},
			required: true, // mandates at least one card is defined for the section to be useful.
			maxRows: 3, // limits the array to three items, suggesting a fixed 3-column layout is intended on the frontend.
			fields: [
				{
					name: "cardImage",
					type: "upload",
					label: "Card Image",
					relationTo: "media",
					required: true, // image is mandatory for the visual design of the card.
				},
				{
					name: "cardTitle",
					type: "text",
					label: "Card Title",
					required: true, // required to provide a clear label for the service.
				},
				{
					name: "cardDescription",
					type: "textarea",
					label: "Card Description",
					required: true, // required for the descriptive text displayed on the card.
				},
				{
					name: "cardLink",
					type: "text",
					label: "Card Link",
					required: true, // link ensures the card is actionable and directs users to the full service page.
				},
			],
		},
	],
};

export { ContentCardServices };
