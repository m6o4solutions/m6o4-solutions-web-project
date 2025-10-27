import { draftMode } from "next/headers";

/**
 * next.js api route handler for explicitly disabling draft mode (live preview).
 * this is typically called to end a content preview session by clearing the
 * associated next.js cookies, forcing the server to fetch only published data.
 *
 * @returns a promise that resolves to an http response confirming the action.
 */
export async function GET(): Promise<Response> {
	// access the next.js draft mode utility from the headers.
	const draft = await draftMode();

	// clears the draft mode cookie, reverting the session to public, published content.
	draft.disable();

	// return a confirmation message to the client.
	return new Response("draft mode is disabled.");
}
