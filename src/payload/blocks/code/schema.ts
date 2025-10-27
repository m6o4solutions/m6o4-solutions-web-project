import type { Block } from "payload";

/**
 * defines a reusable payload block for embedding and highlighting source code.
 * it stores both the code snippet and its corresponding programming language.
 */
const Code: Block = {
	// unique identifier for the block in the database and code.
	slug: "code",
	// typescript interface name for strong typing the block data.
	interfaceName: "CodeBlock",
	// human-readable labels for the admin ui.
	labels: {
		singular: "code block",
		plural: "code blocks",
	},
	// field definitions for the block.
	fields: [
		{
			// allows the user to select the programming language for syntax highlighting.
			name: "language",
			type: "select",
			defaultValue: "typescript",
			options: [
				{
					label: "Typescript",
					value: "typescript",
				},
				{
					label: "Javascript",
					value: "javascript",
				},
				{
					label: "CSS",
					value: "css",
				},
			],
		},
		{
			// the main field for the code content, using payload's dedicated code editor type.
			name: "code",
			type: "code",
			// hides the label in the admin ui as the code field is self-explanatory.
			label: false,
			// requires a code snippet to be entered.
			required: true,
		},
	],
};

// export the block configuration for use in collections/globals.
export { Code };
