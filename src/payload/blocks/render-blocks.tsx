import type { Page } from "@/payload-types";
import { ArchiveBlock } from "@/payload/blocks/archive/component";
import { HeroPrimaryBlock } from "@/payload/blocks/hero-primary/component";
import { HeroSecondaryBlock } from "@/payload/blocks/hero-secondary/component";
import React, { Fragment } from "react";

// map of available block components keyed by blockType
const blockComponents = {
	archive: ArchiveBlock,
	heroPrimary: HeroPrimaryBlock,
	heroSecondary: HeroSecondaryBlock,
} as const;

// types for block structure and valid block keys
type BlockType = NonNullable<Page["layout"]>[number];
type BlockKey = keyof typeof blockComponents;

// props for the RenderBlocks component
interface RenderBlocksProps {
	blocks: BlockType[];
}

/**
 * recursively removes null values and replaces them with undefined.
 * ensures deeply nested objects and arrays are clean.
 */
function normalizeBlock<T>(value: T): T {
	if (value === null) return undefined as unknown as T;

	if (Array.isArray(value)) {
		// process each item in arrays
		return value.map((item) => normalizeBlock(item)) as unknown as T;
	}

	if (typeof value === "object" && value !== undefined) {
		// recursively normalize object entries
		const entries = Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, normalizeBlock(v)]);
		return Object.fromEntries(entries) as T;
	}

	// return primitives as-is
	return value;
}

/**
 * dynamically renders Payload CMS blocks.
 * finds the correct block component and passes in normalized data.
 */
export const RenderBlocks = ({ blocks }: RenderBlocksProps) => {
	if (!Array.isArray(blocks) || blocks.length === 0) return null;

	return (
		<Fragment>
			{blocks.map((block, index) => {
				const key = block.blockType as BlockKey;
				const BlockComponent = blockComponents[key];

				// skip unknown block types
				if (!BlockComponent) return null;

				// infer block props and sanitize block data
				type BlockProps = Extract<BlockType, { blockType: typeof key }>;
				const safeBlock = normalizeBlock(block) as Omit<BlockProps, "id"> & { id?: string };

				// render matching block component
				return <BlockComponent key={index} {...safeBlock} />;
			})}
		</Fragment>
	);
};
