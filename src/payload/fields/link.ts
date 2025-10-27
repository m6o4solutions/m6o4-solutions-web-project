import deepMerge from "@/payload/utilities/deep-merge";
import type { Field, GroupField } from "payload";

export type LinkAppearances = "default" | "outline";

/* defines selectable appearance options for link styling */
const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
	default: {
		label: "Default",
		value: "default",
	},
	outline: {
		label: "Outline",
		value: "outline",
	},
};

/* configures a reusable link field group with optional label, appearance, and overrides */
type LinkType = (options?: {
	appearances?: LinkAppearances[] | false;
	disableLabel?: boolean;
	overrides?: Partial<GroupField>;
}) => Field;

const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
	/* base link group configuration */
	const linkResult: GroupField = {
		name: "link",
		type: "group",
		admin: {
			hideGutter: true,
		},
		fields: [
			{
				type: "row",
				fields: [
					{
						name: "type",
						type: "radio",
						admin: {
							layout: "horizontal",
							width: "50%",
						},
						defaultValue: "reference",
						options: [
							{
								label: "Internal link",
								value: "reference",
							},
							{
								label: "Custom URL",
								value: "custom",
							},
						],
					},
					{
						name: "newTab",
						type: "checkbox",
						admin: {
							style: {
								alignSelf: "flex-end",
							},
							width: "50%",
						},
						label: "Open in new tab",
					},
				],
			},
		],
	};

	/* defines link target fields for internal references and external urls */
	const linkTypes: Field[] = [
		{
			name: "reference",
			type: "relationship",
			admin: {
				condition: (_, siblingData) => siblingData?.type === "reference",
			},
			label: "Document to link to",
			relationTo: ["pages", "posts"],
			required: true,
		},
		{
			name: "url",
			type: "text",
			admin: {
				condition: (_, siblingData) => siblingData?.type === "custom",
			},
			label: "Custom URL",
			required: true,
		},
	];

	/* adds label support if not disabled */
	if (!disableLabel) {
		linkTypes.map((linkType) => ({
			...linkType,
			admin: {
				...linkType.admin,
				width: "50%",
			},
		}));

		linkResult.fields.push({
			type: "row",
			fields: [
				...linkTypes,
				{
					name: "label",
					type: "text",
					admin: {
						width: "50%",
					},
					label: "Label",
					required: true,
				},
			],
		});
	} else {
		linkResult.fields = [...linkResult.fields, ...linkTypes];
	}

	/* adds appearance selector unless explicitly disabled */
	if (appearances !== false) {
		let appearanceOptionsToUse = [appearanceOptions.default, appearanceOptions.outline];

		if (appearances) {
			appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance]);
		}

		linkResult.fields.push({
			name: "appearance",
			type: "select",
			admin: {
				description: "choose how the link should be rendered.",
			},
			defaultValue: "default",
			options: appearanceOptionsToUse,
		});
	}

	/* merges base link configuration with any external overrides */
	return deepMerge(linkResult, overrides);
};

export { appearanceOptions, link };
