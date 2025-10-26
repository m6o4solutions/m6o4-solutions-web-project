import { isPublic } from "@/payload/access/access-control";
import { revalidateFooter } from "@/payload/blocks/globals/footer/hooks/revalidate-footer";
import { link } from "@/payload/fields/link";
import type { GlobalConfig } from "payload";

const Footer: GlobalConfig = {
	slug: "footer",
	access: {
		read: isPublic,
	},
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "organizationName",
					type: "text",
					label: "Name",
					required: true,
					admin: {
						width: "50%",
					},
				},
				{
					name: "organizationSlogan",
					type: "text",
					label: "Slogan",
					required: true,
					admin: {
						width: "50%",
					},
				},
			],
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
			name: "socialItems",
			type: "array",
			label: "Social Media",
			labels: {
				singular: "Social Media Link",
				plural: "Social Media Links",
			},
			fields: [
				link({
					appearances: false,
				}),
			],
			maxRows: 3,
			admin: {
				components: {
					RowLabel: "@/payload/blocks/globals/footer/row-label#RowLabel",
				},
				initCollapsed: true,
			},
		},
		{
			name: "services",
			type: "group",
			label: "Services Column",
			fields: [
				{
					name: "serviceHeader",
					type: "text",
					label: "Header",
				},
				{
					name: "serviceItems",
					type: "array",
					label: "Service Items",
					labels: {
						singular: "Service Link",
						plural: "Service Links",
					},
					fields: [
						link({
							appearances: false,
						}),
					],
					maxRows: 3,
					admin: {
						components: {
							RowLabel: "@/payload/blocks/globals/footer/row-label#RowLabel",
						},
						initCollapsed: true,
					},
				},
			],
		},
		{
			name: "business",
			type: "group",
			label: "Business Column",
			fields: [
				{
					name: "businessHeader",
					type: "text",
					label: "Header",
				},
				{
					name: "businessItems",
					type: "array",
					label: "Business Items",
					labels: {
						singular: "Business Link",
						plural: "Business Links",
					},
					fields: [
						link({
							appearances: false,
						}),
					],
					maxRows: 3,
					admin: {
						components: {
							RowLabel: "@/payload/blocks/globals/footer/row-label#RowLabel",
						},
						initCollapsed: true,
					},
				},
			],
		},
		{
			name: "legal",
			type: "group",
			label: "Legal Column",
			fields: [
				{
					name: "legalHeader",
					type: "text",
					label: "Header",
				},
				{
					name: "legalItems",
					type: "array",
					label: "Legal Items",
					labels: {
						singular: "Legal Link",
						plural: "Legal Links",
					},
					fields: [
						link({
							appearances: false,
						}),
					],
					maxRows: 2,
					admin: {
						components: {
							RowLabel: "@/payload/blocks/globals/footer/row-label#RowLabel",
						},
						initCollapsed: true,
					},
				},
			],
		},
		{
			name: "copyright",
			type: "text",
			label: "Copyright Notice",
			required: true,
		},
	],
	hooks: {
		afterChange: [revalidateFooter],
	},
};

export { Footer };
