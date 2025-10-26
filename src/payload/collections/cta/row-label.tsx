"use client";

import { Header } from "@/payload-types";
import { RowLabelProps, useRowLabel } from "@payloadcms/ui";

type HeaderItem = NonNullable<Header["navigationItems"]>[number];

const RowLabel = (_props: RowLabelProps) => {
	const data = useRowLabel<HeaderItem>();

	const sectionName = "Navigation";

	const label = data?.data?.link?.label
		? `${sectionName} Item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ""}: ${data?.data?.link?.label}`
		: `${sectionName} Row`;

	return <div>{label}</div>;
};

export { RowLabel };
