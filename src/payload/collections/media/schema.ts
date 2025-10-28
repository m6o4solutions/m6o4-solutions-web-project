import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

/**
 * defines the payload collection configuration for 'media'.
 * this collection manages all uploaded images and other media files, including
 * automatic resizing and alt text for accessibility.
 */
const Media: CollectionConfig = {
	// collection identifier in the database and api
	slug: "media",
	// access control defines permissions for media actions.
	access: {
		// only authenticated users can upload new media.
		create: isAuthenticated,
		// only authenticated users can delete media.
		delete: isAuthenticated,
		// media files should be publicly readable for display on the website.
		read: isPublic,
		// only authenticated users can update media metadata.
		update: isAuthenticated,
	},
	// admin configuration for the cms interface.
	admin: {
		// columns displayed by default in the list view for uploaded files.
		defaultColumns: ["filename", "alt", "caption", "createdAt", "updatedAt"],
		// uses the file name as the primary title in the admin ui.
		useAsTitle: "filename",
	},
	// human-readable labels for the collection in the cms.
	labels: {
		singular: "Media",
		plural: "Media",
	},
	// field definitions for media metadata.
	fields: [
		{
			// required description of the image content for accessibility.
			name: "alt",
			type: "text",
			label: "Alt Text",
			required: true,
		},
		{
			// optional rich text field for a caption displayed below the media.
			name: "caption",
			type: "richText",
			label: "Caption",
			// configures the lexical editor for the caption field.
			editor: lexicalEditor({
				// customizes the features available in the editor.
				features: ({ rootFeatures }) => {
					return [
						// include all default rich text features.
						...rootFeatures,
						// sets the toolbar to be fixed at the top of the editor.
						FixedToolbarFeature(),
						// enables the floating toolbar for inline text formatting.
						InlineToolbarFeature(),
					];
				},
			}),
		},
	],
	// upload configuration for image processing.
	upload: {
		// uses the 'thumbnail' size as the preview image in the admin ui.
		adminThumbnail: "thumbnail",
		// enables focal point selection to guide cropping.
		focalPoint: true,
		// definitions for automatic image resizing and cropping.
		imageSizes: [
			{
				// small preview for the admin ui.
				name: "thumbnail",
				width: 300,
			},
			{
				// square crop for profile pictures or grids.
				name: "square",
				width: 500,
				height: 500,
			},
			{
				// small size for general use.
				name: "small",
				width: 600,
			},
			{
				// medium size for main content images.
				name: "medium",
				width: 900,
			},
			{
				// large size for high-resolution displays.
				name: "large",
				width: 1400,
			},
			{
				// extra large size for full-width headers or backgrounds.
				name: "xlarge",
				width: 1920,
			},
			{
				// open graph size for social media sharing cards.
				name: "og",
				width: 1200,
				height: 630,
				// crops the image from the center.
				crop: "center",
			},
		],
		// restricts allowed file types to images only.
		mimeTypes: ["image/*"],
	},
};

// export the collection config for use in payload.
export { Media };
