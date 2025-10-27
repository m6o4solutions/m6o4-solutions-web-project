"use client";

import { Footer } from "@/payload-types";
import { RowLabelProps, useRowLabel } from "@payloadcms/ui";

/**
 * defines a union type for an individual link item from any of the four
 * array fields within the 'footer' global configuration. this ensures
 * correct type inference for row data across social, service, business, and legal links.
 */
type FooterItem =
	| NonNullable<Footer["socialItems"]>[number]
	| NonNullable<NonNullable<Footer["services"]>["serviceItems"]>[number]
	| NonNullable<NonNullable<Footer["business"]>["businessItems"]>[number]
	| NonNullable<NonNullable<Footer["legal"]>["legalItems"]>[number];

/**
 * a custom react component that generates a descriptive label for a row in an array field.
 * it identifies which footer section the row belongs to by checking the field path
 * and uses the link's label to improve clarity in the payload admin ui.
 */
const RowLabel = (_props: RowLabelProps) => {
	// extracts the row data, including the path and row number, using the custom hook.
	const data = useRowLabel<FooterItem>();

	// determines the section name by checking which array field path the data belongs to.
	const sectionName = data.path.includes("socialItems")
		? "social"
		: data.path.includes("serviceItems")
			? "service"
			: data.path.includes("businessItems")
				? "business"
				: data.path.includes("legalItems")
					? "legal"
					: "navigation"; // fallback to 'navigation' if path is unexpected.

	// constructs the final label for the row.
	const label = data?.data?.link?.label
		? // if a link label exists, use it to form a descriptive label: "[section name] item [row number]: [link label]".
			`${sectionName} item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ""}: ${data?.data?.link?.label}`
		: // if the link label is missing, use a generic label: "[section name] row".
			`${sectionName} row`;

	// renders the calculated label string.
	return <div>{label}</div>;
};

// export the component for use in payload's admin ui configuration.
export { RowLabel };
