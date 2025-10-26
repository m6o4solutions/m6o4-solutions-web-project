import type { GlobalConfig } from "payload";

const Branding: GlobalConfig = {
	slug: "branding",
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "organizationIcon",
					label: "Icon",
					type: "upload",
					required: true,
					relationTo: "media",
				},
				{
					name: "organizationLogo",
					label: "Logo",
					type: "upload",
					relationTo: "media",
				},
			],
		},
	],
};

export { Branding };
