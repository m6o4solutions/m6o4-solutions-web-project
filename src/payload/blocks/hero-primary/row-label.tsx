"use client";

import { Header } from "@/payload-types";
import { RowLabelProps, useRowLabel } from "@payloadcms/ui";

/**
 * defines the union type for an item from either the 'navigationitems' or 'ctaitems'
 * array in the 'header' global, ensuring type safety for the row data.
 */
type HeaderItem = NonNullable<Header["ctaItems"]>[number];

/**
 * a custom react component to generate a descriptive label for a row in a payload array field.
 * it dynamically determines if the row belongs to the main navigation or cta section
 * to provide a relevant label, improving clarity in the admin ui.
 */
const RowLabel = (_props: RowLabelProps) => {
	// extracts the row data, including the row number and the array field path, using the custom hook.
	const data = useRowLabel<HeaderItem>();

	// determines the section name based on the path of the array field being edited.
	const sectionName = "Call to Action";

	// logic to construct a meaningful label for the row.
	const label = data?.data?.link?.label
		? // if a link label exists, use it to form a descriptive label: "[section name] item [row number]: [link label]".
			`${sectionName} Item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ""}: ${data?.data?.link?.label}`
		: // if no link label exists, fall back to a generic label: "[section name] row".
			`${sectionName} row`;

	// renders the calculated label string.
	return <div>{label}</div>;
};

// export the component for use in payload's admin ui configuration for both navigation and cta arrays.
export { RowLabel };
