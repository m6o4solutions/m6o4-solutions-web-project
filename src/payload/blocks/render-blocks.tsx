import type { Page } from "@/payload-types";
import { ArchiveBlock } from "@/payload/blocks/archive/component";
import React, { Fragment } from "react";

/**
 * props for the RenderBlocks component.
 */
interface RenderBlocksProps {
	blocks: NonNullable<Page["layout"]>[number][];
}

const blockComponents = {
	archive: ArchiveBlock,
} as const; // use 'as const' to narrow down blockType keys

/**
 * renders a list of blocks dynamically based on the blockType.
 * @param {RenderBlocksProps} props - the component properties.
 * @returns {JSX.Element | null} the rendered blocks wrapped in a Fragment, or null.
 */
const RenderBlocks = (props: RenderBlocksProps) => {
	const { blocks } = props;

	const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

	if (hasBlocks) {
		return (
			<Fragment>
				{blocks.map((block, index) => {
					const key = block.blockType as keyof typeof blockComponents;
					const BlockComponent = blockComponents[key];
					return BlockComponent ? <BlockComponent key={index} {...(block as any)} /> : null;
				})}
			</Fragment>
		);
	}

	return null;
};

export { RenderBlocks };
