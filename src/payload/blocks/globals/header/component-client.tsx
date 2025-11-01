"use client";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Header } from "@/payload-types";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface HeaderClientProps {
	// the data fetched from the 'header' global in payload.
	data: Header;
}

/**
 * a client component that renders the application's sticky header.
 * it manages the state for the mobile menu (sheet) and displays branding,
 * navigation links, and call-to-action buttons based on the provided payload data.
 */
const HeaderClient = ({ data }: HeaderClientProps) => {
	// destructure and assign header fields for cleaner access.
	const ctaItems = data?.ctaItems;
	const image = data?.organizationLogo;
	const name = data?.organizationName;
	const navigationItems = data?.navigationItems;

	// state to control the open/closed status of the mobile menu sheet.
	const [isOpen, setIsOpen] = useState(false);

	// safely extract the image url from the payload image object, checking for object type and 'url' property.
	const imageSrc = typeof image === "object" && "url" in image && image.url ? image.url : "";
	// safely extract the alt text, checking for object type and 'alt' property.
	const imageAlt = typeof image === "object" && "alt" in image && image.alt ? image.alt : "";

	return (
		// main header container, styled to be sticky at the top with a z-index.
		<header className="sticky top-0 z-50 w-full bg-white shadow-sm">
			<Container>
				{/* inner content wrapper to align items and set height. */}
				<div className="flex h-6 items-center justify-between">
					{/* logo and organization name, linked to the home page. */}
					<Link href="/" className="flex items-center space-x-2">
						{/* relative wrapper for the next/image component. */}
						<div className="relative size-8 shrink-0">
							{/* organization logo, using next/image for optimization. */}
							<Image src={imageSrc} alt={imageAlt} fill priority className="text-brand-primary object-cover" />
						</div>
						{/* organization name display. */}
						<div className="text-brand-primary text-2xl font-semibold">{name}</div>
					</Link>

					{/* primary navigation links, hidden on mobile screens. */}
					<nav className="hidden items-center space-x-8 md:flex">
						{navigationItems?.map(({ link }, index) => (
							<Link
								key={index}
								// use '#' as a fallback url.
								href={link.url || "#"}
								className="text-text-default hover:text-brand-primary-light font-medium no-underline transition-colors"
							>
								{/* use '#' as a fallback label. */}
								{link.label || "#"}
							</Link>
						))}
					</nav>

					{/* header call-to-action button, hidden on mobile screens. */}
					<div className="hidden md:block">
						{ctaItems?.map(({ link }, index) => (
							<Button
								key={index}
								asChild
								className="bg-brand-accent hover:bg-brand-accent-hover rounded-xl px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg"
							>
								<Link href={link.url || "#"} target={link.newTab ? "_blank" : "_self"}>
									{link.label || "#"}
								</Link>
							</Button>
						))}
					</div>

					{/* mobile menu sheet component, visible only on mobile screens. */}
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild className="md:hidden">
							{/* menu icon button to open the mobile sheet. */}
							<Button variant="ghost" size="icon">
								<Menu className="size-6" />
							</Button>
						</SheetTrigger>
						{/* content of the mobile menu sheet. */}
						<SheetContent side="right" className="w-full bg-white p-6">
							{/* mobile navigation links, stacked vertically. */}
							<nav className="mt-8 flex flex-col space-y-6">
								{navigationItems?.map(({ link }, index) => (
									<Link
										key={index}
										href={link.url || "#"}
										className="text-text-default hover:text-brand-primary-light text-lg font-medium no-underline transition-colors"
										// closes the sheet when a navigation link is clicked.
										onClick={() => setIsOpen(false)}
									>
										{link.label || "#"}
									</Link>
								))}

								{/* mobile cta buttons. */}
								{ctaItems?.map(({ link }, index) => (
									<Button
										key={index}
										asChild
										className="bg-brand-accent hover:bg-brand-accent-hover rounded-xl px-6 py-3 font-medium text-white shadow-md"
									>
										<Link href={link.url || "#"} target={link.newTab ? "_blank" : "_self"}>
											{link.label || "#"}
										</Link>
									</Button>
								))}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</Container>
		</header>
	);
};

// export the client component for use by the server-side header component.
export { HeaderClient };
