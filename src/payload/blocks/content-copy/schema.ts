import { Banner } from "@/payload/blocks/banner/schema";
import {
	BlocksFeature,
	FixedToolbarFeature,
	HeadingFeature,
	InlineToolbarFeature,
	lexicalEditor,
	OrderedListFeature,
	UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

/* defines a reusable payload block for rich text content with configurable formatting.
   designed to support structured writing with headings, inline styling, and embedded blocks like banners. */
const ContentCopy: Block = {
	slug: "contentCopy",
	interfaceName: "ContentCopy",
	labels: {
		singular: "Content Copy Block",
		plural: "Content Copy Blocks",
	},
	fields: [
		{
			name: "copy",
			type: "richText",
			label: false,
			/* uses lexical as the rich text editor to provide a balance of structured and flexible content editing.
			   the feature set prioritizes readability and editorial control while maintaining consistent formatting. */
			editor: lexicalEditor({
				features: ({ rootFeatures }) => [
					...rootFeatures,
					FixedToolbarFeature(), // keeps key formatting tools visible for better authoring UX
					HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }), // restricts heading sizes for design consistency
					BlocksFeature({ blocks: [Banner] }), // allows inline embedding of banner components
					InlineToolbarFeature(), // enables contextual text formatting
					OrderedListFeature(), // supports structured lists for clarity
					UnorderedListFeature(), // supports bullet lists for readability
				],
			}),
		},
	],
};

export { ContentCopy };
