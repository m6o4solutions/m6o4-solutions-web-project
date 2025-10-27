import { link } from "@/payload/fields/link";
import type { LinkAppearances } from "@/payload/fields/link";
import deepMerge from "@/payload/utilities/deep-merge";
import type { ArrayField, Field } from "payload";

/* defines a reusable factory for creating an array of link fields with optional appearance and configuration overrides */
type LinkGroupType = (options?: { appearances?: LinkAppearances[] | false; overrides?: Partial<ArrayField> }) => Field;

const linkGroup: LinkGroupType = ({ appearances, overrides = {} } = {}) => {
	/* base configuration for the link group array */
	const generatedLinkGroup: Field = {
		name: "links",
		type: "array",
		fields: [link({ appearances })],
		admin: { initCollapsed: true },
	};

	/* merges base group settings with external overrides for flexibility */
	return deepMerge(generatedLinkGroup, overrides);
};

export { linkGroup };
