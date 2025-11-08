import {
	AlignFeature,
	FixedToolbarFeature,
	HeadingFeature,
	InlineToolbarFeature,
	lexicalEditor,
	OrderedListFeature,
	UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

const Form: Block = {
	slug: "form",
	interfaceName: "Form",
	labels: {
		singular: "Form Block",
		plural: "Form Blocks",
	},
	graphQL: {
		singularName: "Form",
	},
	fields: [
		{
			name: "form",
			type: "relationship",
			relationTo: "forms",
			required: true,
		},
		{
			name: "enableIntro",
			type: "checkbox",
			label: "Enable Introductory Content",
		},
		{
			name: "introContent",
			type: "richText",
			label: "Introductory Content",
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					return [
						...rootFeatures,
						HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
						FixedToolbarFeature(),
						InlineToolbarFeature(),
						OrderedListFeature(),
						UnorderedListFeature(),
						AlignFeature(),
					];
				},
			}),
			admin: {
				condition: (_, { enableIntro }) => Boolean(enableIntro),
			},
		},
	],
};

export { Form };
