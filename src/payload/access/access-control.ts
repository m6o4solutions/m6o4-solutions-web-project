import type { User } from "@/payload-types";
import type { Access, AccessArgs } from "payload";

// defines a custom type for a simple access function that returns a boolean.
type IsAuthenticated = (args: AccessArgs<User>) => boolean;

/**
 * access control function that checks if a user is currently logged in.
 * it grants access if a user object exists on the request.
 *
 * @returns true if the user is authenticated, false otherwise.
 */
const isAuthenticated: IsAuthenticated = ({ req: { user } }) => {
	// converts the presence of the user object to a boolean.
	return Boolean(user);
};

/**
 * access control function that grants read access if:
 * 1. the user is currently authenticated.
 * 2. the document's '_status' field is explicitly set to 'published'.
 * this is commonly used for public-facing content like pages and posts.
 *
 * @returns true if authenticated, or an access query restricting access to published documents.
 */
const isAuthenticatedOrPublished: Access = ({ req: { user } }) => {
	// if the user is logged in, grant full access.
	if (user) {
		return true;
	}

	// otherwise, restrict access to only documents where the status is 'published'.
	return {
		_status: {
			equals: "published",
		},
	};
};

/**
 * access control function that grants full, unrestricted access to all users,
 * including unauthenticated guests.
 *
 * @returns true, allowing access without any restrictions.
 */
const isPublic: Access = () => true;

// export all access control functions for use in payload collection and global configurations.
export { isAuthenticated, isAuthenticatedOrPublished, isPublic };
