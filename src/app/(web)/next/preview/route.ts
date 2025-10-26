import config from "@payload-config";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getPayload } from "payload";
import type { CollectionSlug, PayloadRequest } from "payload";

/**
 * @function GET
 * @description next.js api route handler for enabling draft mode (live preview).
 * this endpoint is typically called by payload cms to start a live preview session.
 * it performs security checks, validates user authentication, and enables next.js draft mode
 * before redirecting the user to the content path.
 *
 * @param {NextRequest} req - the incoming http request, containing search parameters and headers.
 * @returns {Promise<Response>} an http response indicating success, error, or a redirect.
 */
export async function GET(req: NextRequest): Promise<Response> {
	// initialize payload to access auth and database functionality
	const payload = await getPayload({ config: config });

	// extract search parameters from the request url
	const { searchParams } = new URL(req.url);

	// the relative path to redirect to after enabling draft mode (e.g., '/about-us')
	const path = searchParams.get("path");

	// the collection slug of the document being previewed (e.g., 'pages')
	const collection = searchParams.get("collection") as CollectionSlug;

	// the slug of the document being previewed
	const slug = searchParams.get("slug");

	// a secret token used for basic security verification
	const previewSecret = searchParams.get("previewSecret");

	// check if the provided secret matches the environment secret
	if (previewSecret !== process.env.PREVIEW_SECRET) {
		return new Response("You are not allowed to preview this page.", { status: 403 });
	}

	// ensure all required parameters are present
	if (!path || !collection || !slug) {
		return new Response("Insufficient search params.", { status: 404 });
	}

	// safety check: ensure the path is a relative path starting with '/'
	if (!path.startsWith("/")) {
		return new Response("This endpoint can only be used for relative previews.", {
			status: 500,
		});
	}

	let user;

	// attempt to authenticate the user using the payload token in the cookies/headers
	try {
		user = await payload.auth({
			// cast nextrequest to payloadrequest for compatibility with payload's auth function
			req: req as unknown as PayloadRequest,
			headers: req.headers,
		});
	} catch (error) {
		// log any errors during token verification
		payload.logger.error({ err: error }, "Error verifying token for live preview.");
		return new Response("You are not allowed to preview this page.", { status: 403 });
	}

	// access next.js draft mode utility
	const draft = await draftMode();

	// if authentication fails, disable draft mode (if it was active) and deny access
	if (!user) {
		draft.disable();
		return new Response("You are not allowed to preview this page.", { status: 403 });
	}

	// you can add additional checks here to see if the user is allowed to preview this page,
	// for example, checking user roles or document access permissions.

	// security checks passed, enable next.js draft mode
	draft.enable();

	// redirect the user to the content path, which will now render draft content
	redirect(path);
}
