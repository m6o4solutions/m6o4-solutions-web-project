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

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const iconURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/file/${process.env.NEXT_PUBLIC_META_ICON}`;

export default buildConfig({
	admin: {
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
	collections: collections,
	db: mongooseAdapter({ url: process.env.DATABASE_URI! }),
	editor: lexical,
	email: resend,
	globals: globals,
	plugins: [...plugins],
	secret: process.env.PAYLOAD_SECRET!,
	sharp,
	typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
	jobs: {
		access: {
			run: ({ req }: { req: PayloadRequest }): boolean => {
				// allow logged in users to execute this endpoint (default)
				if (req.user) return true;

				// if there is no logged in user, then check for the vercel
				// cron secret to be present as an authorization header:
				const authHeader = req.headers.get("authorization");

				return authHeader === `Bearer ${process.env.CRON_SECRET}`;
			},
		},
		tasks: [],
	},
});
