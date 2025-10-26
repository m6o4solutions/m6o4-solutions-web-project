import { ImageMedia } from "@/components/media/image-media";
import type { Props } from "@/components/media/types";
import { VideoMedia } from "@/components/media/video-media";
import React, { Fragment } from "react";

/**
 * @component media
 * @description the main media abstraction component. it inspects the 'resource' prop
 * (typically a payload media object) to determine if it's a video or an image,
 * and delegates rendering to the appropriate sub-component (videomedia or imagemedia).
 * it also allows wrapping the media in a custom html element.
 *
 * @param {string} [className] - classes for the wrapper element.
 * @param {ElementType | null} [htmlElement="div"] - the html tag to wrap the content (e.g., 'div', 'span').
 * if null, it uses react.fragment.
 * @param {MediaType | string | number | null} resource - the media data object from payload or a static source.
 * @param {Props} rest - all other props (fill, priority, alt, etc.) passed down to sub-components.
 */
const Media = ({ className, htmlElement = "div", resource, ...rest }: Props) => {
	// logic to determine if the resource is a video by checking the mimetype property.
	const isVideo = typeof resource === "object" && resource?.mimeType?.includes("video");

	// sets the wrapper tag to the specified html element or react.fragment if htmlElement is null.
	const Tag = htmlElement || Fragment;

	return (
		<Tag
			// conditionally spreads props onto the wrapper. if htmlElement is null (using fragment),
			// we avoid passing props like className, which fragments cannot accept.
			{...(htmlElement !== null
				? {
						className,
					}
				: {})}
		>
			{/* conditional rendering: if it's a video, render videomedia; otherwise, render imagemedia. */}
			{isVideo ? (
				<VideoMedia resource={resource} className={className} {...rest} />
			) : (
				<ImageMedia resource={resource} className={className} {...rest} />
			)}
		</Tag>
	);
};

export { Media };
