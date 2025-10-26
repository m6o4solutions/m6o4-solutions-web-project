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
	data: Header;
}

const HeaderClient = ({ data }: HeaderClientProps) => {
	// declare varibales
	const ctaItems = data?.ctaItems;
	const image = data?.organizationLogo;
	const name = data?.organizationName;
	const navigationItems = data?.navigationItems;
	const [isOpen, setIsOpen] = useState(false);

	// safely extract the image url from the payload image object, falling back to an empty string
	const imageSrc = typeof image === "object" && "url" in image && image.url ? image.url : "";
	// safely extract the alt text, falling back to an empty string
	const imageAlt = typeof image === "object" && "alt" in image && image.alt ? image.alt : "";

	return (
		<div className="sticky top-0 z-50 w-full bg-white shadow-sm">
			<Container>
				<div className="flex h-6 items-center justify-between">
					{/* logo */}
					<Link href="/" className="flex items-center space-x-2">
						<div className="relative size-8 shrink-0">
							<Image src={imageSrc} alt={imageAlt} fill priority className="text-brand-primary object-cover" />
						</div>
						<div className="text-brand-primary text-2xl font-semibold">{name}</div>
					</Link>

					{/* desktop menu */}
					<nav className="hidden items-center space-x-8 md:flex">
						{navigationItems?.map(({ link }, index) => (
							<Link
								key={index}
								href={link.url || "#"}
								className="text-text-default hover:text-brand-primary-light font-medium no-underline transition-colors"
							>
								{link.label || "#"}
							</Link>
						))}
					</nav>

					{/* header call to action */}
					<div className="hidden md:block">
						{ctaItems?.map(({ link }, index) => (
							<Button
								key={index}
								asChild
								className="bg-brand-accent hover:bg-brand-accent-hover rounded-xl px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg"
							>
								<Link href={link.url || "#"} target="_blank">
									{link.label || "#"}
								</Link>
							</Button>
						))}
					</div>

					{/* mobile menu */}
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild className="md:hidden">
							<Button variant="ghost" size="icon">
								<Menu className="size-6" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-full bg-white p-6">
							<nav className="mt-8 flex flex-col space-y-6">
								{navigationItems?.map(({ link }, index) => (
									<Link
										key={index}
										href={link.url || "#"}
										className="text-text-default hover:text-brand-primary-light text-lg font-medium no-underline transition-colors"
										onClick={() => setIsOpen(false)}
									>
										{link.label || "#"}
									</Link>
								))}

								{ctaItems?.map(({ link }, index) => (
									<Button
										key={index}
										asChild
										className="bg-brand-accent hover:bg-brand-accent-hover rounded-xl px-6 py-3 font-medium text-white shadow-md"
									>
										<Link href={link.url || "#"} target="_blank">
											{link.label || "#"}
										</Link>
									</Button>
								))}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</Container>
		</div>
	);
};

export { HeaderClient };
