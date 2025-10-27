import type { Page } from "@/payload-types";
import { ArchiveBlock } from "@/payload/blocks/archive/component";
import { HeroPrimaryBlock } from "@/payload/blocks/hero-primary/component";
import { HeroSecondaryBlock } from "@/payload/blocks/hero-secondary/component";
import React, { Fragment } from "react";

// 1. maps the payload block names (blocktype slugs) to their corresponding react components.
const blockComponents = {
	archive: ArchiveBlock,
	heroPrimary: HeroPrimaryBlock,
	heroSecondary: HeroSecondaryBlock,
} as const;

// type utility to extract the union of all block keys (e.g., 'archive' | 'hero-primary').
type BlockKey = keyof typeof blockComponents;

// 2. type utility that maps each block key to its exact payload-generated type definition.
type BlockPropsMap = {
	[K in BlockKey]: Extract<NonNullable<Page["layout"]>[number], { blockType: K }>;
};

/**
 * 3. recursively transforms all 'null' values within an object or array to 'undefined'.
 * this is necessary because payload cms uses null for empty fields, but react components
 * often prefer undefined to correctly omit properties.
 *
 * @param value - the value to normalize (can be an object, array, or primitive).
 * @returns the normalized value with nulls replaced by undefined.
 */
function normalizeBlock<T>(value: T): T {
	if (value === null) return undefined as unknown as T;

	if (Array.isArray(value)) return value.map(normalizeBlock) as unknown as T;

	if (typeof value === "object" && value !== undefined) {
		// recursively process all object properties.
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeBlock(v)])) as T;
	}

	return value;
}

interface RenderBlocksProps {
	// expects the array of blocks from the payload document's layout field.
	blocks: NonNullable<Page["layout"]>;
}

/**
 * 4. a helper function to safely look up and render a block component.
 * it applies the recursive null-to-undefined normalization before spreading props.
 *
 * @param block - the block object with a blocktype property.
 * @param key - the react key for the component.
 * @returns the rendered react component for the given block.
 */
function renderBlock<B extends BlockKey>(block: BlockPropsMap[B], key: number) {
	// look up the component based on the blocktype.
	const Component = blockComponents[block.blockType] as React.ComponentType<any>;
	// apply normalization, safely omitting the payload-specific 'id' field if it is present.
	const safeBlock = normalizeBlock(block) as Omit<typeof block, "id"> & { id?: string };
	// render the component with the normalized block data spread as props.
	return <Component key={key} {...safeBlock} />;
}

/**
 * the main component for rendering payload layout blocks.
 * it iterates over the blocks array and uses a switch statement for runtime type narrowing
 * to ensure the correct component is rendered for each blocktype.
 */
export const RenderBlocks = ({ blocks }: RenderBlocksProps) => {
	// defensively return null if the blocks array is invalid or empty.
	if (!Array.isArray(blocks) || blocks.length === 0) return null;

	return (
		// use react.fragment to avoid adding an unnecessary wrapper element to the dom.
		<Fragment>
			{blocks.map((block, index) => {
				// 5. use a switch statement to perform runtime blocktype checking (narrowing).
				switch (block.blockType) {
					// explicitly list all known block types.
					case "archive":
					case "heroPrimary":
					case "heroSecondary":
						// render the block using the helper function. we use 'as any' here
						// because the typescript compiler trusts the runtime switch narrowing.
						return renderBlock(block as any, index);
					default:
						// gracefully ignore any unknown or unexpected block types.
						return null;
				}
			})}
		</Fragment>
	);
};
