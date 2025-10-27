import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

/**
 * defines a reusable payload block for displaying contextual banner messages
 * (e.g., info, warning, error, success) within rich text content or layouts.
 */
const Banner: Block = {
	// unique identifier for the block.
	slug: "banner",
	// typescript interface name for type safety.
	interfaceName: "BannerBlock",
	// human-readable labels for the admin ui.
	labels: {
		singular: "banner block",
		plural: "banner blocks",
	},
	// field definitions for the block content.
	fields: [
		{
			// allows content editors to select the visual style/intent of the banner,
			// which dictates its color and presentation on the frontend.
			name: "style",
			type: "select",
			required: true,
			defaultValue: "info",
			options: [
				{ label: "Info", value: "info" },
				{ label: "Warning", value: "warning" },
				{ label: "Error", value: "error" },
				{ label: "Success", value: "success" },
			],
		},
		{
			// the main text content of the banner, using the lexical rich text editor.
			name: "content",
			type: "richText",
			required: true,
			// hides the label in the admin ui for a cleaner look.
			label: false,
			// custom configuration for the rich text editor.
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					// adds the fixed and inline toolbars to the editor for this specific field,
					// inheriting other configured features from the root lexical setup.
					return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()];
				},
			}),
		},
	],
};

// export the block configuration for use in collections/globals.
export { Banner };
