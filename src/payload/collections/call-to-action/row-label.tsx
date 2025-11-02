"use client";

import { Header } from "@/payload-types";
import { RowLabelProps, useRowLabel } from "@payloadcms/ui";

/**
 * defines the expected shape for an individual item within the 'navigationItems' array
 * of the 'header' global, ensuring type safety for the row data.
 */
type HeaderItem = NonNullable<Header["navigationItems"]>[number];

/**
 * a custom react component to generate a descriptive label for a row in a payload array field.
 * this improves clarity in the admin ui by naming the row based on the user-entered link label.
 */
const RowLabel = (_props: RowLabelProps) => {
	// extracts the row data, including the row number, using the custom hook.
	const data = useRowLabel<HeaderItem>();

	// constant for the general section name to ensure consistency.
	const sectionName = "Navigation";

	// logic to construct a meaningful label for the row.
	const label = data?.data?.link?.label
		? // if a link label exists, use it to form a descriptive label: "navigation item [row number]: [link label]".
			`${sectionName} item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ""}: ${data?.data?.link?.label}`
		: // if no link label exists, fall back to a generic label: "navigation row".
			`${sectionName} row`;

	// renders the calculated label string.
	return <div>{label}</div>;
};

// export the component for use in payload's admin ui configuration.
export { RowLabel };
