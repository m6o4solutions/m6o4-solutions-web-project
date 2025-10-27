import type { Block } from "payload";

/**
 * defines a reusable payload block for embedding a single media item (image/video)
 * into a rich text editor or flexible content layout.
 * this decouples the media content from the layout structure.
 */
const Media: Block = {
	// unique identifier for the block in the database and code.
	slug: "media",
	// typescript interface name for strong typing the block data.
	interfaceName: "MediaBlock",
	// human-readable labels for the admin ui.
	labels: {
		singular: "Media Block",
		plural: "Media Blocks",
	},
	// field definitions for the block.
	fields: [
		{
			// establishes a relationship to the 'media' collection.
			name: "media",
			type: "upload",
			// ensures a file is selected for the block to be valid.
			required: true,
			relationTo: "media",
		},
	],
};

// export the block configuration for use in collections/globals.
export { Media };
