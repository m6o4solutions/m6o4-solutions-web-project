import type { Page } from "@/payload-types";
import { ArchiveBlock } from "@/payload/blocks/archive/component";
import { CallToActionBlock } from "@/payload/blocks/call-to-action/component";
import { ContentCardsServicesBlock } from "@/payload/blocks/content-cards-services/component";
import { ContentCardsWorkBlock } from "@/payload/blocks/content-cards-work/component";
import { ContentCardsBlock } from "@/payload/blocks/content-cards/component";
import { ContentCopyBlock } from "@/payload/blocks/content-copy/component";
import { ContentGridBlock } from "@/payload/blocks/content-grid/component";
import { FrequentlyAskedQuestionsBlock } from "@/payload/blocks/faqs/components";
import { FormBlock } from "@/payload/blocks/forms/component";
import { HeroPrimaryBlock } from "@/payload/blocks/hero-primary/component";
import { HeroSecondaryBlock } from "@/payload/blocks/hero-secondary/component";
import { LogosBlock } from "@/payload/blocks/logos/component";
import { TestimonialsBlock } from "@/payload/blocks/testimonials/component";
import { ComponentType, Fragment } from "react";

/* defines which payload block types map to which react components.
   this acts as a registry that drives dynamic page rendering. */
const blockComponents = {
	archive: ArchiveBlock,
	callToAction: CallToActionBlock,
	contentCards: ContentCardsBlock,
	contentCardsServices: ContentCardsServicesBlock,
	contentCardsWork: ContentCardsWorkBlock,
	contentCopy: ContentCopyBlock,
	contentGrid: ContentGridBlock,
	frequentlyAskedQuestions: FrequentlyAskedQuestionsBlock,
	form: FormBlock,
	heroPrimary: HeroPrimaryBlock,
	heroSecondary: HeroSecondaryBlock,
	logos: LogosBlock,
	testimonials: TestimonialsBlock,
} as const;

type BlockKey = keyof typeof blockComponents;

/* sanitizes payload data by recursively replacing null values with undefined.
   prevents react warnings and maintains predictable prop behavior. */
function normalizeBlock<T>(value: T): T {
	if (value === null) return undefined as unknown as T;

	if (Array.isArray(value)) return value.map(normalizeBlock) as unknown as T;

	if (typeof value === "object" && value !== undefined) {
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeBlock(v)])) as T;
	}

	return value;
}

interface RenderBlocksProps {
	blocks: NonNullable<Page["layout"]>;
}

/* dynamically renders blocks defined in payload cms.
   each block type is matched to its component, normalized, and safely passed as props.
   casting through 'unknown' is intentional to satisfy typescript's strictness
   when widening discriminated unions into generic record props. */
export const RenderBlocks = ({ blocks }: RenderBlocksProps) => {
	if (!Array.isArray(blocks) || blocks.length === 0) return null;

	return (
		<Fragment>
			{blocks.map((block, index) => {
				const Component = blockComponents[block.blockType as BlockKey];
				if (!Component) return null;

				const normalized = normalizeBlock(block);

				// acknowledge and explicitly widen block data for runtime-safe prop spreading
				const safeProps = normalized as unknown as Record<string, unknown>;

				// safely cast component type to accept the widened props
				const TypedComponent = Component as unknown as ComponentType<Record<string, unknown>>;

				return <TypedComponent key={index} {...safeProps} />;
			})}
		</Fragment>
	);
};
