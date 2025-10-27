import { ImageMedia } from "@/components/media/image-media";
import type { Props } from "@/components/media/types";
import { VideoMedia } from "@/components/media/video-media";
import React, { Fragment } from "react";

/**
 * the primary media component that acts as a router for image and video rendering.
 * it inspects the payload media object's mime type to determine the correct sub-component
 * and wraps the rendered output in a customizable html tag.
 */
const Media = ({ className, htmlElement = "div", resource, ...rest }: Props) => {
	// determine if the resource is an object and if its mimetype property includes 'video'.
	const isVideo = typeof resource === "object" && resource?.mimeType?.includes("video");

	// set the wrapper tag, defaulting to 'div' or using react.fragment if 'htmlElement' is null.
	const Tag = htmlElement || Fragment;

	return (
		<Tag
			// conditionally apply the className only if a concrete html element is used,
			// as react.fragment cannot accept dom attributes.
			{...(htmlElement !== null ? { className } : {})}
		>
			{/* delegate rendering based on the media type */}
			{isVideo ? (
				// render video media component, passing all props through.
				<VideoMedia resource={resource} className={className} {...rest} />
			) : (
				// render image media component (including svgs and other non-video types).
				<ImageMedia resource={resource} className={className} {...rest} />
			)}
		</Tag>
	);
};

// export the versatile media component.
export { Media };
