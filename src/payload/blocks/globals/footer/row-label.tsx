"use client";

import { Footer } from "@/payload-types";
import { RowLabelProps, useRowLabel } from "@payloadcms/ui";

// create a reusable type that covers all arrays
type FooterItem =
	| NonNullable<Footer["socialItems"]>[number]
	| NonNullable<NonNullable<Footer["services"]>["serviceItems"]>[number]
	| NonNullable<NonNullable<Footer["business"]>["businessItems"]>[number]
	| NonNullable<NonNullable<Footer["legal"]>["legalItems"]>[number];

const RowLabel = (_props: RowLabelProps) => {
	const data = useRowLabel<FooterItem>();

	const sectionName = data.path.includes("socialItems")
		? "Social"
		: data.path.includes("serviceItems")
			? "Service"
			: data.path.includes("businessItems")
				? "Business"
				: data.path.includes("legalItems")
					? "Legal"
					: "Navigation";

	const label = data?.data?.link?.label
		? `${sectionName} Item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ""}: ${data?.data?.link?.label}`
		: `${sectionName} Row`;

	return <div>{label}</div>;
};

export { RowLabel };
