import config from "@payload-config";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getPayload } from "payload";
import type { CollectionSlug, PayloadRequest } from "payload";

/**
 * next.js api route handler for enabling draft mode (live preview).
 * this endpoint validates the request, authenticates the user, enables next.js's
 * built-in draft mode, and redirects the user to the content path for live preview.
 *
 * @param req - the incoming next.js http request.
 * @returns a promise that resolves to an http response (redirect or error).
 */
export async function GET(req: NextRequest): Promise<Response> {
	// initialize payload instance to interact with the database and authentication.
	const payload = await getPayload({ config: config });

	// extract search parameters from the request url for necessary metadata.
	const { searchParams } = new URL(req.url);

	// the target url path to redirect to after enabling preview (e.g., /posts/my-post).
	const path = searchParams.get("path");

	// the collection slug of the document being previewed (e.g., 'pages', 'posts').
	const collection = searchParams.get("collection") as CollectionSlug;

	// the slug of the specific document (used for informational/security checks).
	const slug = searchParams.get("slug");

	// a secret token expected to match the environment variable for basic security.
	const previewSecret = searchParams.get("previewSecret");

	// security check 1: verify the request token against the server secret.
	if (previewSecret !== process.env.PREVIEW_SECRET) {
		return new Response("you are not allowed to preview this page.", { status: 403 });
	}

	// validation check: ensure all required parameters were provided.
	if (!path || !collection || !slug) {
		return new Response("insufficient search params.", { status: 404 });
	}

	// validation check: ensure the path is a relative url starting with '/'.
	if (!path.startsWith("/")) {
		return new Response("this endpoint can only be used for relative previews.", {
			status: 500,
		});
	}

	let user;

	// security check 2: attempt to authenticate the user using the token found in cookies/headers.
	try {
		user = await payload.auth({
			// cast the nextrequest to payloadrequest to satisfy payload's auth function signature.
			req: req as unknown as PayloadRequest,
			headers: req.headers,
		});
	} catch (error) {
		// log the error and reject unauthenticated requests.
		payload.logger.error({ err: error }, "error verifying token for live preview.");
		return new Response("you are not allowed to preview this page.", { status: 403 });
	}

	// access the next.js draft mode utility.
	const draft = await draftMode();

	// final security check: if authentication failed, ensure draft mode is disabled and deny access.
	if (!user) {
		draft.disable();
		return new Response("you are not allowed to preview this page.", { status: 403 });
	}

	// all security checks passed, enable next.js draft mode.
	// this sets a cookie that tells next.js to fetch draft content for subsequent requests.
	draft.enable();

	// redirect the authenticated user to the content path.
	redirect(path);
}
