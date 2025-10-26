import { isPublic } from "@/payload/access/access-control";
import { revalidateHeader } from "@/payload/blocks/globals/header/hooks/revalidate-header";
import { link } from "@/payload/fields/link";
import type { GlobalConfig } from "payload";

const Header: GlobalConfig = {
	slug: "header",
	access: {
		read: isPublic,
	},
	fields: [
		{
			name: "organizationName",
			type: "text",
			label: "Name",
			required: true,
		},
		{
			name: "organizationLogo",
			label: "Logo",
			type: "upload",
			relationTo: "media",
			required: true,
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "navigationItems",
			type: "array",
			label: "Navigation Items",
			labels: {
				singular: "Navigation Item",
				plural: "Navigation Items",
			},
			fields: [
				link({
					appearances: false,
				}),
			],
			maxRows: 5,
			admin: {
				components: {
					RowLabel: "@/payload/blocks/globals/header/row-label#RowLabel",
				},
				initCollapsed: true,
			},
		},
		{
			name: "ctaItems",
			type: "array",
			label: "Call to Action Items",
			labels: {
				singular: "Call to Action Item",
				plural: "Call to Action Items",
			},
			fields: [
				link({
					appearances: false,
				}),
			],
			maxRows: 1,
			admin: {
				components: {
					RowLabel: "@/payload/blocks/globals/header/row-label#RowLabel",
				},
				initCollapsed: true,
			},
		},
	],
	hooks: {
		afterChange: [revalidateHeader],
	},
};

export { Header };
