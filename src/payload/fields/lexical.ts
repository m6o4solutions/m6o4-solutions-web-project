import {
	BoldFeature,
	ItalicFeature,
	lexicalEditor,
	LinkFeature,
	ParagraphFeature,
	UnderlineFeature,
	type LinkFields,
} from "@payloadcms/richtext-lexical";
import type { TextFieldSingleValidation } from "payload";

/* configure a lexical editor instance with common text formatting and custom link field behavior */
const lexical = lexicalEditor({
	features: [
		/* basic text formatting options */
		BoldFeature(),
		ItalicFeature(),
		ParagraphFeature(),
		UnderlineFeature(),

		/* custom link feature that integrates internal document linking with validation */
		LinkFeature({
			enabledCollections: ["pages", "posts"],

			/* customize link fields by redefining url behavior */
			fields: ({ defaultFields }) => {
				/* remove the default url field to replace it with custom logic */
				const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
					if ("name" in field && field.name === "url") return false;
					return true;
				});

				/* reintroduce url field with conditional rendering and validation */
				return [
					...defaultFieldsWithoutUrl,
					{
						name: "url",
						type: "text",
						admin: {
							/* only show url field when link type is not internal */
							condition: (_data, siblingData) => siblingData?.linkType !== "internal",
						},
						label: ({ t }) => t("fields:enterURL"),
						required: true,

						/* validate url only when the link type is external */
						validate: ((value, options) => {
							if ((options?.siblingData as LinkFields)?.linkType === "internal") {
								return true;
							}
							return value ? true : "URL is required.";
						}) as TextFieldSingleValidation,
					},
				];
			},
		}),
	],
});

export { lexical };
