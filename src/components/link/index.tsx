import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Page, Post } from "@/payload-types";
import Link from "next/link";
import { ReactNode } from "react";

/**
 * defines the properties for the cmslink component, mirroring the
 * structure of a link field within payload cms.
 */
type CMSLinkType = {
	// dictates the link's visual style: "inline" for a text link, or a button variant (e.g., "default", "outline").
	appearance?: "inline" | ButtonProps["variant"];
	// optional react nodes passed as children to display inside the link element.
	children?: ReactNode;
	// custom tailwind classes to apply to the root element.
	className?: string;
	// the text label for the link.
	label?: string | null;
	// indicates if the link should open in a new tab.
	newTab?: boolean | null;
	// the payload relationship object for internal document links.
	reference?: {
		// the collection being linked to (e.g., "pages", "posts").
		relationTo: "pages" | "posts";
		// the actual document object (populated) or its id (not populated).
		value: Page | Post | string | number;
	} | null;
	// the size of the button if appearance is a button variant.
	size?: ButtonProps["size"] | null;
	// the type of link: 'custom' for an external url, or 'reference' for an internal payload document.
	type?: "custom" | "reference" | null;
	// the raw url string for 'custom' links.
	url?: string | null;
};

/**
 * a universal component to render links, capable of handling payload
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
	// 1. determine the final href. checks for a 'reference' type with a populated document (object with slug).
	const href =
		type === "reference" && typeof reference?.value === "object" && reference.value.slug
			? // construct the internal path: adds a collection prefix (e.g., /posts) unless it's a 'page'.
				`${reference?.relationTo !== "pages" ? `/${reference?.relationTo}` : ""}/${reference.value.slug}`
			: // fall back to the custom url string.
				url;

	// do not render the component if no valid destination url could be determined.
	if (!href) return null;

	// 2. prepare common link properties.
	// adjust button size: if the appearance is the 'link' variant, set size to 'clear' for proper styling.
	const size = appearance === "link" ? "clear" : sizeFromProps;
	// set accessibility and security attributes for opening in a new tab.
	const newTabProps = newTab ? { rel: "noopener noreferrer", target: "_blank" } : {};

	// 3. rendering logic: standard inline link.
	if (appearance === "inline") {
		// render as a standard text anchor tag using next/link for client-side navigation.
		return (
			<Link className={cn(className)} href={href || url || ""} {...newTabProps}>
				{label && label}
				{children && children}
			</Link>
		);
	}

	// 4. rendering logic: button link.
	return (
		// wrap the next/link component in the styled button component.
		<Button asChild className={className} size={size} variant={appearance}>
			{/* the 'aschild' prop on the button ensures the link receives all button styling. */}
			<Link className={cn(className)} href={href || url || ""} {...newTabProps}>
				{label && label}
				{children && children}
			</Link>
		</Button>
	);
};

// export the versatile cms link component.
export { CMSLink };
