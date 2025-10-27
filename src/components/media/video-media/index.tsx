"use client";

import type { Props as MediaProps } from "@/components/media/types";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/payload/utilities/get-media-url";
import React, { useEffect, useRef } from "react";

/**
 * a client-side component that renders a video element.
 * it is specifically configured for decorative, background use: autoplaying, looping, and muted.
 * it relies on a payload media object to construct the video source url.
 */
const VideoMedia = ({ onClick, resource, videoClassName }: MediaProps) => {
	// ref to gain direct access to the underlying <video> element for managing playback/events.
	const videoRef = useRef<HTMLVideoElement>(null);

	// handles side effects after initial render.
	useEffect(() => {
		const { current: video } = videoRef;

		if (video) {
			// attaches a listener for the 'suspend' event.
			// this is often used to manage video loading states, though the current implementation is a no-op.
			video.addEventListener("suspend", () => {});
		}
		// runs only once on mount to attach the event listener.
		// note: the listener should ideally be cleaned up, but 'suspend' generally does not need to be removed.
	}, []);

	// ensure the resource is a valid object before attempting to render.
	if (resource && typeof resource === "object") {
		const { filename } = resource;

		return (
			<video
				// enables automatic playback (often requires 'muted' to work in modern browsers).
				autoPlay
				// merge custom classes provided via props.
				className={cn(videoClassName)}
				// hides the browser's native playback controls.
				controls={false}
				// ensures the video repeats indefinitely.
				loop
				// disables audio (required for autoplay in many environments).
				muted
				// attaches the click handler from props.
				onClick={onClick}
				// ensures inline playback, particularly for mobile safari.
				playsInline
				// attaches the ref to the dom element.
				ref={videoRef}
			>
				{/* defines the video source by constructing the full public url from the filename. */}
				<source src={getMediaUrl(`/media/${filename}`)} />
			</video>
		);
	}

	// returns nothing if the resource data is missing or invalid.
	return null;
};

// export the video media component.
export { VideoMedia };
