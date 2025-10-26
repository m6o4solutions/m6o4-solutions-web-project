import { draftMode } from "next/headers";

/**
 * @function GET
 * @description next.js api route handler for explicitly disabling draft mode (live preview).
 * this endpoint is typically called when a user wants to exit a live preview session,
 * clearing the preview cookies and reverting to fetching only published content.
 *
 * @returns {Promise<Response>} an http response confirming that draft mode has been disabled.
 */
export async function GET(): Promise<Response> {
	// access next.js draft mode utility
	const draft = await draftMode();

	// disable next.js draft mode, clearing the preview cookies
	draft.disable();

	// return a simple confirmation response
	return new Response("Draft mode is disabled.");
}
