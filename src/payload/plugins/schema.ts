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
import {
	FixedToolbarFeature,
	HeadingFeature,
	lexicalEditor,
	OrderedListFeature,
	UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { Plugin } from "payload";

/* 
defines a dynamic seo title generator for pages and posts
adds the document title followed by the company name if available
*/
const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
	return doc?.title ? `${doc.title} | M6O4 Solutions` : "M6O4 Solutions";
};

/* 
defines a dynamic canonical url generator for pages and posts
uses the server-side base url and the document slug if present
*/
const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
	const url = getServerSideURL();
	return doc?.slug ? `${url}/${doc.slug}` : url;
};

/* 
central plugin registry for the payload cms instance
registers all key plugins: forms, seo, redirects, search, s3, and cloud integration
*/
const plugins: Plugin[] = [
	/* 
	form builder plugin configuration
	disables unused default fields and extends the confirmation message field 
	to support a lexical rich text editor with heading and toolbar features
	*/
	formBuilderPlugin({
		fields: { country: false, payment: false, state: false },
		formOverrides: {
			fields: ({ defaultFields }) => {
				return defaultFields.map((field) => {
					if ("name" in field && field.name === "confirmationMessage") {
						return {
							...field,
							editor: lexicalEditor({
								features: ({ rootFeatures }) => [
									...rootFeatures,
									FixedToolbarFeature(),
									HeadingFeature({
										enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
									}),
									OrderedListFeature(),
									UnorderedListFeature(),
								],
							}),
						};
					}
					return field;
				});
			},
		},
	}),

	/* integrates with payload cloud for hosting and deployment */
	payloadCloudPlugin(),

	/* 
	redirects plugin configuration
	enables redirect management for pages and posts
	adds a descriptive admin note and triggers site revalidation after changes
	*/
	redirectsPlugin({
		collections: ["pages", "posts"],
		overrides: {
			fields: ({ defaultFields }) => {
				return defaultFields.map((field) => {
					if (typeof field === "object" && "name" in field && field.name === "from") {
						return {
							...field,
							admin: {
								...(field.admin ?? {}),
								description: "You will need to rebuild the website when changing this field.",
							},
						} as typeof field;
					}
					return field;
				}) as typeof defaultFields;
			},
			hooks: {
				afterChange: [revalidateRedirects],
			},
		},
	}),

	/* 
	s3 storage plugin configuration
	sets s3 as the media storage provider using environment credentials
	*/
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

	/* 
	search plugin configuration
	indexes posts and extends default search fields
	preprocesses content before indexing for better search quality
	*/
	searchPlugin({
		collections: ["posts"],
		beforeSync: beforeSyncWithSearch,
		searchOverrides: {
			fields: ({ defaultFields }) => [...defaultFields, ...searchFields],
		},
	}),

	/* 
	seo plugin configuration
	enables automatic seo metadata generation with dynamic title and url handling
	*/
	seoPlugin({ generateTitle, generateURL }),
];

export { plugins };
