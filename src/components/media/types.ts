import type { Media as MediaType } from "@/payload-types";
import type { StaticImageData } from "next/image";
import type { ElementType, Ref } from "react";

/**
 * defines the props for a versatile media component.
 * it supports rendering images from payload cms, static imports,
 * and allows for dynamic wrapping/styling of the underlying html.
 */
export interface Props {
	// optional alt text for the rendered media, for accessibility.
	alt?: string;
	// classes to be applied to the main wrapper or root element.
	className?: string;
	// flag to determine if the next/image should fill its parent container.
	fill?: boolean;
	// allows overriding the wrapper element type (e.g., 'div', 'span', null to render children directly).
	htmlElement?: ElementType | null;
	// classes applied specifically to the <picture> element wrapper when using responsive image sources.
	pictureClassName?: string;
	// classes applied directly to the final <img> element.
	imgClassName?: string;
	// click event handler for the media element.
	onClick?: () => void;
	// load event handler for the media element.
	onLoad?: () => void;
	// loading strategy for next/image ('lazy' or 'eager').
	loading?: "lazy" | "eager";
	// flag to prioritize image loading (for lcp images in next/image).
	priority?: boolean;
	// react ref to forward to the underlying html element (img or video).
	ref?: Ref<HTMLImageElement | HTMLVideoElement | null>;
	// the media source data: can be a full payload media object, id, or url string.
	resource?: MediaType | string | number | null;
	// sizes attribute string for responsive image optimization in next/image.
	size?: string;
	// source data for locally imported static image files (next/image specific).
	src?: StaticImageData;
	// classes applied specifically to the <video> element when rendering a video.
	videoClassName?: string;
}
