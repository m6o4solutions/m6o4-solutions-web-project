import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Page, Post } from "@/payload-types";
import Link from "next/link";
import React, { ReactNode } from "react";

/**
 * @typedef cmslinktype
 * @description defines the properties for the cmslink component, mirroring the
 * structure of a link field within payload cms.
 */
type CMSLinkType = {
	// how the link should look: "inline" (text) or a button variant (e.g., "default", "outline").
	appearance?: "inline" | ButtonProps["variant"];
	// optional react nodes passed as children to display inside the link.
	children?: ReactNode;
	// custom tailwind classes.
	className?: string;
	// the text label for the link.
	label?: string | null;
	// indicates if the link should open in a new tab.
	newTab?: boolean | null;
	// the payload reference object for internal links.
	reference?: {
		// the collection being linked to.
		relationTo: "pages" | "posts";
		// the actual document object or its id.
		value: Page | Post | string | number;
	} | null;
	// the size of the button if appearance is not 'inline'.
	size?: ButtonProps["size"] | null;
	// the type of link: 'custom' (external url) or 'reference' (internal payload doc).
	type?: "custom" | "reference" | null;
	// the raw url string for 'custom' links.
	url?: string | null;
};

/**
 * @component cmslink
 * @description a universal component to render links, capable of handling payload
 * document references and external urls, and styling them as either inline text or buttons.
 */
const CMSLink = ({
	type,
	appearance = "inline",
	children,
	className,
	label,
	newTab,
	reference,
	size: sizeFromProps,
	url,
}: CMSLinkType) => {
	// 1. determines the final href based on link type.
	const href =
		// check if it's a reference link AND the value object exists AND it has a slug.
		type === "reference" && typeof reference?.value === "object" && reference.value.slug
			? // constructs the internal path: includes '/posts' prefix if not linking to a 'page'.
				`${reference?.relationTo !== "pages" ? `/${reference?.relationTo}` : ""}/${reference.value.slug}`
			: // otherwise, use the custom url string.
				url;

	// return null if no valid url could be determined.
	if (!href) return null;

	// 2. adjusts button size if appearance is a button variant.
	const size = appearance === "link" ? "clear" : sizeFromProps;
	// sets props for opening in a new tab for security and functionality.
	const newTabProps = newTab ? { rel: "noopener noreferrer", target: "_blank" } : {};

	// 3. rendering logic:
	if (appearance === "inline") {
		// render as a standard text anchor tag using next/link.
		return (
			<Link className={cn(className)} href={href || url || ""} {...newTabProps}>
				{label && label}
				{children && children}
			</Link>
		);
	}

	// render as a styled button wrapping a next/link component.
	return (
		<Button asChild className={className} size={size} variant={appearance}>
			{/* the button uses aschild, making the inner link component receive the button's styling. */}
			<Link className={cn(className)} href={href || url || ""} {...newTabProps}>
				{label && label}
				{children && children}
			</Link>
		</Button>
	);
};

export { CMSLink };
