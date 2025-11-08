import { Banner } from "@/payload/blocks/banner/schema";
import {
	AlignFeature,
	BlocksFeature,
	FixedToolbarFeature,
	HeadingFeature,
	InlineToolbarFeature,
	lexicalEditor,
	OrderedListFeature,
	UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

// defines a reusable Payload CMS block for content sections.
// it combines optional metadata (headlines) with a rich text editor for the main body.
const ContentCopy: Block = {
	slug: "contentCopy",
	interfaceName: "ContentCopy",
	labels: {
		singular: "Content Copy Block",
		plural: "Content Copy Blocks",
	},
	fields: [
		{
			name: "headerBanner",
			type: "group",
			label: false,
			fields: [
				{
					name: "headline",
					type: "text",
					label: "Headline",
				},
				{
					name: "subheadline",
					type: "text",
					label: "Subheadline",
				},
			],
		},
		{
			name: "copy",
			type: "richText",
			label: false,
			// configures the lexical editor for structured, easy-to-use content editing.
			editor: lexicalEditor({
				features: ({ rootFeatures }) => [
					...rootFeatures,
					// keeps the primary formatting toolbar visible at all times, improving editor user experience.
					FixedToolbarFeature(),
					// restricts available heading sizes to maintain design and typographic consistency on the frontend.
					HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
					// allows content editors to embed other blocks, specifically the 'banner' component, within the rich text flow.
					BlocksFeature({ blocks: [Banner] }),
					// enables a floating toolbar for text selection-based formatting.
					InlineToolbarFeature(),
					// enables standard ordered lists for sequential information.
					OrderedListFeature(),
					// enables standard unordered lists for general bulleted items.
					UnorderedListFeature(),
					// adds support for text alignment.
					AlignFeature(),
				],
			}),
		},
	],
};

export { ContentCopy };
