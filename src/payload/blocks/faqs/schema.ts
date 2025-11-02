import type { Block } from "payload";

// defines the faq block configuration used in payload cms
// this block allows editors to add a headline, subheadline, and select multiple faq entries
// the relationship field links to individual faq documents for centralized content management
// interfaceName ensures type generation for strongly typed rendering in front-end components
const FrequentlyAskedQuestions: Block = {
	slug: "frequentlyAskedQuestions",
	interfaceName: "FrequentlyAskedQuestions",
	labels: {
		singular: "Frequently Asked Questions Block",
		plural: "Frequently Asked Questions Blocks",
	},
	fields: [
		{
			name: "headline",
			type: "text",
			label: "Headline",
			required: true,
		},
		{
			name: "subheadline",
			type: "text",
			label: "Subheadline",
		},
		{
			name: "faqs",
			type: "relationship",
			label: "Select FAQs",
			relationTo: "faq",
			required: true,
			hasMany: true,
		},
	],
};

export { FrequentlyAskedQuestions };
