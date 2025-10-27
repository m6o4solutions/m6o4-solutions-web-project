import { resendAdapter } from "@payloadcms/email-resend";
import { Config } from "payload";

/* 
configures the resend email adapter for payload cms
uses environment variables for sender details and api key
*/
const resend: Config["email"] = resendAdapter({
	defaultFromAddress: process.env.RESEND_FROM_EMAIL!,
	defaultFromName: process.env.RESEND_FROM_NAME!,
	apiKey: process.env.RESEND_API_KEY!,
});

export { resend };
