import type { Media as MediaType } from "@/payload-types";
import type { StaticImageData } from "next/image";
import type { ElementType, Ref } from "react";

/**
 * @interface Props
 * @description defines the props for a versatile media component capable of rendering
 * payload cms media, static next.js images, or standard html elements (e.g., video/img).
 */
export interface Props {
	// standard alt text for accessibility.
	alt?: string;
	// classes applied to the main wrapper/root element.
	className?: string;
	// boolean flag to make the image fill the parent container (next.js Image specific).
	fill?: boolean;
	// allows the component to be rendered as a different html element (e.g., 'div', 'span').
	htmlElement?: ElementType | null;
	// classes applied specifically to the <picture> element wrapper (if used).
	pictureClassName?: string;
	// classes applied directly to the final <img> element.
	imgClassName?: string;
	// click event handler.
	onClick?: () => void;
	// load event handler.
	onLoad?: () => void;
	// loading strategy for the image ('lazy' is default) (Next.js Image specific).
	loading?: "lazy" | "eager";
	// priority loading flag for lcp images (next.js Image specific).
	priority?: boolean;
	// forwarded Ref for accessing the underlying DOM element (img or video).
	ref?: Ref<HTMLImageElement | HTMLVideoElement | null>;
	// the source data: either a full Payload Media object or its ID/URL string.
	resource?: MediaType | string | number | null;
	// sizes attribute for responsive image loading (next.js Image specific).
	size?: string;
	// source data for locally imported static images (next.js Image specific).
	src?: StaticImageData;
	// classes applied specifically to the <video> element.
	videoClassName?: string;
}
