import { RichText } from "@/components/rich-text";
import { cn } from "@/lib/utils";
import type { BannerBlock as BannerBlockProps } from "@/payload-types";

// component props, combining the payload block data with an optional className for styling.
type Props = { className?: string } & BannerBlockProps;

/**
 * a reusable react component that displays content within a contextual banner.
 * the component dynamically applies border and background colors based on the
 * 'style' field (info, error, success, warning) retrieved from the payload cms.
 */
const BannerBlock = ({ className, content, style }: Props) => {
	return (
		// outer container with standard horizontal margins and vertical spacing for the block.
		<div className={cn("mx-auto my-8 w-full", className)}>
			<div
				className={cn(
					// base styles for the banner wrapper (flex, rounded, border, padding).
					"flex items-center rounded border px-6 py-3",
					{
						// conditional styling based on the selected 'style' from payload:
						// 'info' uses neutral card/border colors.
						"border-border bg-card": style === "info",
						// 'error' uses red/error colors with a light background tint.
						"border-error bg-error/30": style === "error",
						// 'success' uses green/success colors with a light background tint.
						"border-success bg-success/30": style === "success",
						// 'warning' uses yellow/warning colors with a light background tint.
						"border-warning bg-warning/30": style === "warning",
					},
				)}
			>
				{/* renders the rich text content from payload inside the banner. */}
				<RichText
					data={content}
					// disables the default gutter/prose wrapper since the banner provides its own styling.
					enableGutter={false}
					enableProse={false}
				/>
			</div>
		</div>
	);
};

// export the block component for use in layouts or rich text rendering.
export { BannerBlock };
