import { formatSlugHook } from "@/payload/fields/slug/format-slug";
import type { CheckboxField, TextField } from "payload";

/* optional configuration overrides for slug and checkbox fields */
type Overrides = {
	slugOverrides?: Omit<Partial<TextField>, "hasMany">;
	checkboxOverrides?: Partial<CheckboxField>;
};

/* defines the function signature for generating a slug and its controlling checkbox */
type Slug = (fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField];

const slugField: Slug = (fieldToUse = "title", overrides = {}) => {
	const { slugOverrides, checkboxOverrides } = overrides;

	/* defines a hidden checkbox used to control whether the slug field is editable or locked */
	const checkBoxField: CheckboxField = {
		name: "slugLock",
		type: "checkbox",
		defaultValue: true,
		admin: {
			hidden: true,
			position: "sidebar",
		},
		...checkboxOverrides,
	};

	/* defines the slug text field with a pre-validation hook and a custom client-side component */
	const slugField = {
		name: "slug",
		type: "text",
		index: true,
		label: "Slug",
		...(slugOverrides || {}),
		hooks: {
			beforeValidate: [formatSlugHook(fieldToUse)],
		},
		admin: {
			position: "sidebar",
			...(slugOverrides?.admin || {}),
			components: {
				Field: {
					path: "@/payload/fields/slug/component#SlugComponent",
					clientProps: {
						fieldToUse,
						checkboxFieldPath: checkBoxField.name,
					},
				},
			},
		},
	} as TextField;

	/* returns the slug text field and the controlling checkbox as a pair */
	return [slugField, checkBoxField];
};

export { slugField };
