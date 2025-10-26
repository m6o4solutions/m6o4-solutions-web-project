"use client";

import type { Props as MediaProps } from "@/components/media/types";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/payload/utilities/get-media-url";
import React, { useEffect, useRef } from "react";

/**
 * @component videomedia
 * @description renders a video element using payload cms media data.
 * it is configured for background video usage: autoplay, loop, and muted.
 *
 * @param {function} [onClick] - click handler for the video element.
 * @param {object} resource - the payload media object containing video details.
 * @param {string} [videoClassName] - tailwind classes to apply directly to the <video> element.
 */
const VideoMedia = ({ onClick, resource, videoClassName }: MediaProps) => {
	// creates a ref to directly access the native html <video> dom element.
	const videoRef = useRef<HTMLVideoElement>(null);

	// useeffect hook to attach a temporary event listener on component mount.
	// the 'suspend' listener is often used here as a placeholder or to manage
	// browser-specific loading issues, though its current implementation is empty.
	useEffect(() => {
		const { current: video } = videoRef;

		if (video) {
			// currently attaches a no-op listener; often a placeholder for load/error handling.
			video.addEventListener("suspend", () => {});
		}
		// dependency array is empty, so it runs only once on mount.
	}, []);

	// conditional rendering: only proceed if the resource data object is present.
	if (resource && typeof resource === "object") {
		const { filename } = resource;

		return (
			<video
				// enables automatic playback when loaded.
				autoPlay
				// merges custom video classes.
				className={cn(videoClassName)}
				// disables native browser controls (intended for background/decorative video).
				controls={false}
				// ensures the video repeats indefinitely.
				loop
				// disables audio (required for autoplay in most browsers).
				muted
				onClick={onClick}
				// ensures the video is played within the element's bounds, not fullscreen (ios requirement).
				playsInline
				// attaches the ref for dom access.
				ref={videoRef}
			>
				{/* defines the video source by constructing the full url using the filename. */}
				<source src={getMediaUrl(`/media/${filename}`)} />
			</video>
		);
	}

	// returns null if no valid resource object is provided.
	return null;
};

export { VideoMedia };
