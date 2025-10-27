"use client";

import { Media } from "@/components/media";
import { RichText } from "@/components/rich-text";
import { cn } from "@/lib/utils";
import type { MediaBlock as MediaBlockProps } from "@/payload-types";
import type { StaticImageData } from "next/image";
import React from "react";

// extends the payload-defined block props with component-specific presentation and content overrides.
type Props = MediaBlockProps & {
	// boolean to determine if the block should extend beyond standard content width (unused in current logic but kept for future use).
	breakout?: boolean;
	// custom tailwind classes for styling the caption container.
	captionClassName?: string;
	// custom tailwind classes for the outermost div container.
	className?: string;
	// flag to apply container padding (gutter) to the outermost block wrapper. defaults to true.
	enableGutter?: boolean;
	// custom tailwind classes for styling the img or video element itself.
	imgClassName?: string;
	// allows passing a local next/image static asset instead of a payload relationship.
	staticImage?: StaticImageData;
	// flag to disable the inner container class application for the caption, allowing full-width text.
	disableInnerContainer?: boolean;
};

/**
 * a block component for displaying a single image or video (media component) with an optional rich text caption.
 * it supports media linked via payload cms relationships or local static next.js image imports.
 */
const MediaBlock = (props: Props) => {
	const {
		captionClassName,
		className,
		// destructure with default value for the gutter.
		enableGutter = true,
		imgClassName,
		media,
		staticImage,
		disableInnerContainer,
	} = props;

	let caption;
	// safely extracts the rich text caption data from the media object if it exists and is populated.
	if (media && typeof media === "object") caption = media.caption;

	return (
		// outermost container that controls the overall width and applies an optional gutter.
		<div
			className={cn(
				"",
				{
					// conditionally applies the 'container' class if enablegutter is true.
					container: enableGutter,
				},
				// merge with any external classes passed to the component.
				className,
			)}
		>
			{/* renders the media component if either a payload media object or static image is provided. */}
			{(media || staticImage) && (
				<Media
					// combines default border styling with any custom classes for the image element.
					imgClassName={cn("border border-border rounded-[0.8rem]", imgClassName)}
					// payload media object passed as a resource.
					resource={media}
					// static image import passed as the source.
					src={staticImage}
				/>
			)}
			{/* conditionally renders the caption if it exists on the media object. */}
			{caption && (
				<div
					className={cn(
						"mt-6", // top margin to separate the caption from the media.
						{
							// conditionally applies the 'container' class to the caption for alignment.
							container: !disableInnerContainer,
						},
						captionClassName,
					)}
				>
					{/* renders the rich text content of the caption, explicitly disabling the gutter since it is handled by the parent div. */}
					<RichText data={caption} enableGutter={false} />
				</div>
			)}
		</div>
	);
};

// export the block for use in page layout blocks.
export { MediaBlock };
