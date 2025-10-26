import type { Page } from "@/payload-types";
import { ArchiveBlock } from "@/payload/blocks/archive/component";
import React, { Fragment } from "react";

/**
 * props for the RenderBlocks component.
 */
interface RenderBlocksProps {
	blocks: Page["layout"][0][];
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
					const { blockType } = block;

					// use the block type check to ensure type safety with blockComponents keys
					if (blockType && typeof blockType === "string" && blockType in blockComponents) {
						const Block = blockComponents[blockType as keyof typeof blockComponents];

						if (Block) {
							return (
								<div key={index}>
									{/* @ts-expect-error there may be some mismatch between the expected types here */}
									<Block {...block} />
								</div>
							);
						}
					}
					return null;
				})}
			</Fragment>
		);
	}

	return null;
};

export { RenderBlocks };
