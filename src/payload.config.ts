import path from "path";
import { fileURLToPath } from "url";
import { globals } from "@/payload/blocks/globals";
import { collections } from "@/payload/collections";
import { Users } from "@/payload/collections/users/schema";
import { lexical } from "@/payload/fields/lexical";
import { resend } from "@/payload/fields/resend";
import { plugins } from "@/payload/plugins/schema";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig, PayloadRequest } from "payload";
import sharp from "sharp";

// resolve current file and directory paths
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// define site icon url using environment variables
const iconURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/file/${process.env.NEXT_PUBLIC_META_ICON}`;

// export main payload cms configuration
export default buildConfig({
	admin: {
		// customize admin ui components and metadata
		components: {
			graphics: {
				Logo: "/components/payload/logo/index.tsx#Logo",
				Icon: "/components/payload/icon/index.tsx#Icon",
			},
		},
		importMap: {
			baseDir: path.resolve(dirname),
		},
		meta: {
			icons: [
				{
					fetchPriority: "high",
					rel: "icon",
					sizes: "32x32",
					type: "image/svg+xml",
					url: iconURL,
				},
			],
			titleSuffix: " | M6O4 Solutions",
		},
		user: Users.slug,
	},
	// register cms collections
	collections: collections,

	// configure database connection
	db: mongooseAdapter({ url: process.env.DATABASE_URI! }),

	// set up text editor and email service
	editor: lexical,
	email: resend,

	// register global settings and plugins
	globals: globals,
	plugins: [...plugins],

	// define security and image processing settings
	secret: process.env.PAYLOAD_SECRET!,
	sharp,

	// enable typescript type generation
	typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },

	// define background job permissions and tasks
	jobs: {
		access: {
			run: ({ req }: { req: PayloadRequest }): boolean => {
				// allow logged-in users
				if (req.user) return true;

				// allow vercel cron jobs with a valid secret
				const authHeader = req.headers.get("authorization");
				return authHeader === `Bearer ${process.env.CRON_SECRET}`;
			},
		},
		tasks: [],
	},
});
