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

// defines a dynamic seo title generator for pages and posts.
// adds the document title followed by the company name, M6O4 Solutions.
const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
	return doc?.title ? `${doc.title} | M6O4 Solutions` : "M6O4 Solutions";
};

// defines a dynamic canonical url generator for pages and posts.
// uses the server-side base url and the document slug to construct the full url.
const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
	const url = getServerSideURL();
	return doc?.slug ? `${url}/${doc.slug}` : url;
};

// central plugin registry for the payload cms instance.
// registers all key plugins: forms, seo, redirects, search, s3, and cloud integration.
const plugins: Plugin[] = [
	// configures the form builder plugin.
	// disables default fields (country, payment, state) and customizes the confirmation message editor.
	formBuilderPlugin({
		fields: { country: false, payment: false, state: false },
		formOverrides: {
			fields: ({ defaultFields }) => {
				// maps over default fields to customize the confirmation message field.
				const customizedFields = defaultFields.map((field) => {
					if ("name" in field && field.name === "confirmationMessage") {
						// overrides the editor to use lexical with fixed toolbar, headings, and lists.
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

				// returns all customized fields and appends the custom recaptcha field.
				return [
					...customizedFields,
					{
						name: "requireRecaptcha",
						type: "checkbox",
						label: "Require reCAPTCHA",
						admin: {
							position: "sidebar", // positions the field in the admin sidebar.
						},
					},
				];
			},
		},
	}),

	// integrates with payload cloud for hosting and deployment.
	payloadCloudPlugin(),

	// configures the redirects plugin for pages and posts collections.
	// adds a rebuild warning to the 'from' field and revalidates the site after a redirect change.
	redirectsPlugin({
		collections: ["pages", "posts"],
		overrides: {
			fields: ({ defaultFields }) => {
				return defaultFields.map((field) => {
					if (typeof field === "object" && "name" in field && field.name === "from") {
						// adds an admin note instructing the user to rebuild the site upon changing a redirect source.
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
				afterChange: [revalidateRedirects], // triggers site revalidation hook.
			},
		},
	}),

	// configures s3 storage as the media storage provider.
	// uses environment variables for bucket name and access credentials.
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
			forcePathStyle: true, // required for minio or self-hosted s3 systems.
		},
	}),

	// configures the search plugin.
	// indexes the posts collection, uses a custom hook for content preprocessing, and includes custom search fields.
	searchPlugin({
		collections: ["posts"],
		beforeSync: beforeSyncWithSearch, // hook to clean or modify content before it's indexed.
		searchOverrides: {
			// combines default search fields with custom defined fields for indexing.
			fields: ({ defaultFields }) => [...defaultFields, ...searchFields],
		},
	}),

	// configures the seo plugin.
	// uses custom functions to dynamically generate page titles and canonical urls.
	seoPlugin({ generateTitle, generateURL }),
];

export { plugins };
