import { Page, Post } from "@/payload-types";
import { revalidateRedirects } from "@/payload/hooks/revalidate-redirects";
import { beforeSyncWithSearch } from "@/payload/search/before-sync";
import { searchFields } from "@/payload/search/field-overrides";
import { getServerSideURL } from "@/payload/utilities/get-url";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { searchPlugin } from "@payloadcms/plugin-search";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types";
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { Plugin } from "payload";

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
	return doc?.title ? `${doc.title} | M6O4 Solutions` : "M6O4 Solutions";
};

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
	const url = getServerSideURL();

	return doc?.slug ? `${url}/${doc.slug}` : url;
};

const plugins: Plugin[] = [
	formBuilderPlugin({
		fields: {
			country: false,
			payment: false,
			state: false,
		},
		formOverrides: {
			fields: ({ defaultFields }) => {
				return defaultFields.map((field) => {
					if ("name" in field && field.name === "confirmationMessage") {
						return {
							...field,
							editor: lexicalEditor({
								features: ({ rootFeatures }) => {
									return [
										...rootFeatures,
										FixedToolbarFeature(),
										HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
									];
								},
							}),
						};
					}
					return field;
				});
			},
		},
	}),
	payloadCloudPlugin(),
	redirectsPlugin({
		collections: ["pages", "posts"],
		overrides: {
			// @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
			fields: ({ defaultFields }) => {
				return defaultFields.map((field) => {
					if ("name" in field && field.name === "from") {
						return {
							...field,
							admin: {
								description: "You will need to rebuild the website when changing this field.",
							},
						};
					}
					return field;
				});
			},
			hooks: {
				afterChange: [revalidateRedirects],
			},
		},
	}),
	s3Storage({
		collections: {
			media: true,
		},
		bucket: process.env.S3_BUCKET!,
		config: {
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY_ID!,
				secretAccessKey: process.env.S3_ACCESS_KEY_SECRET!,
			},
			region: process.env.S3_REGION!,
			endpoint: process.env.S3_ENDPOINT!,
			forcePathStyle: true,
		},
	}),
	searchPlugin({
		collections: ["posts"],
		beforeSync: beforeSyncWithSearch,
		searchOverrides: {
			fields: ({ defaultFields }) => {
				return [...defaultFields, ...searchFields];
			},
		},
	}),
	seoPlugin({ generateTitle, generateURL }),
];

export { plugins };
