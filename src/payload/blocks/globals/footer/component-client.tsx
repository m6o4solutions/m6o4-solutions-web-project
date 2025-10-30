import { Container } from "@/components/container";
import type { Footer } from "@/payload-types";
import { Facebook, Globe, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FooterClientProps {
	// the data fetched from the 'footer' global in payload.
	data: Footer;
}

/**
 * helper function to determine the appropriate social media icon based on keywords
 * found in the url or link label.
 *
 * @param urlOrLabel - the link url or label string to check.
 * @returns the corresponding lucide react icon component.
 */
const getSocialIcon = (urlOrLabel: string) => {
	// convert to lowercase once for case-insensitive checking.
	const value = urlOrLabel.toLowerCase();

	if (value.includes("linkedin")) return <Linkedin className="size-5" />;
	if (value.includes("facebook")) return <Facebook className="size-5" />;
	// checks for both 'twitter' and 'x.com' for the twitter/x icon.
	if (value.includes("twitter") || value.includes("x.com")) return <Twitter className="size-5" />;

	// fallback icon for general websites or unknown social links.
	return <Globe className="size-5" />;
};

/**
 * a client component that renders the application's footer.
 * it displays branding, social media links with corresponding icons,
 * navigation columns for services, business, and legal links, and the copyright notice.
 */
const FooterClient = async ({ data }: FooterClientProps) => {
	// destructure and assign footer fields for cleaner access.
	const business = data?.business;
	const copyright = data?.copyright;
	const image = data?.organizationLogo;
	const legal = data?.legal;
	const name = data?.organizationName;
	const services = data?.services;
	const slogan = data?.organizationSlogan;
	const socialItems = data?.socialItems;

	// safely extract the image url from the payload image object, checking for object type and 'url' property.
	const imageSrc = typeof image === "object" && "url" in image && image.url ? image.url : "";
	// safely extract the alt text, checking for object type and 'alt' property.
	const imageAlt = typeof image === "object" && "alt" in image && image.alt ? image.alt : "";

	return (
		// main footer container with dark background and light text.
		<div className="bg-[#1C2A3A] text-white">
			<Container>
				{/* grid layout for the main content area, changing from a single column to a four-column layout on medium screens. */}
				<div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
					{/* organization info column (takes up 2 fractional units on desktop). */}
					<div className="space-y-4">
						{/* logo and organization name, linked to the home page. */}
						<Link href="/" className="flex items-center space-x-2">
							{/* relative wrapper for the next/image component. */}
							<div className="relative size-8 shrink-0">
								{/* organization logo. */}
								<Image src={imageSrc} alt={imageAlt} fill priority className="object-cover text-white/80" />
							</div>
							{/* organization name display. */}
							<div className="text-2xl font-semibold text-white/80">{name}</div>
						</Link>

						{/* organization slogan text. */}
						<p className="text-sm text-white/80">{slogan}</p>

						{/* social links section, only renders if items exist. */}
						{socialItems && socialItems.length > 0 && (
							<div className="flex items-center gap-4">
								{socialItems.map((item, index) => {
									// safely extract url and label.
									const href = item.link?.url || "#";
									const label = item.link?.label || "#";
									// determine the icon using the helper function.
									const icon = getSocialIcon(href || label);

									return (
										<Link
											key={index}
											href={href}
											target={item.link?.newTab ? "_blank" : "_self"}
											rel="noopener noreferrer"
											// apply hover transition for visual feedback.
											className="text-white/80 transition-colors hover:text-white"
											// provide aria-label for accessibility.
											aria-label={label}
										>
											{icon}
										</Link>
									);
								})}
							</div>
						)}
					</div>

					{/* services links column. */}
					<div className="space-y-4">
						{/* column header, falling back to 'services'. */}
						<h4 className="text-lg font-semibold text-white/80 uppercase">{services?.serviceHeader || "services"}</h4>
						<ul className="space-y-3 text-sm">
							{services?.serviceItems?.map((item, i) => (
								<li key={i}>
									<Link
										href={item.link?.url || "#"}
										className="text-white/80 no-underline transition-colors hover:text-white"
									>
										{item.link?.label || "#"}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* business links column. */}
					<div className="space-y-4">
						{/* column header, falling back to 'business'. */}
						<h4 className="text-lg font-semibold text-white/80 uppercase">{business?.businessHeader || "business"}</h4>
						<ul className="space-y-3 text-sm">
							{business?.businessItems?.map((item, i) => (
								<li key={i}>
									<Link
										href={item.link?.url || "#"}
										className="text-white/80 no-underline transition-colors hover:text-white"
									>
										{item.link?.label || "#"}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* legal links column. */}
					<div className="space-y-4">
						{/* column header, falling back to 'legal'. */}
						<h4 className="text-lg font-semibold text-white/80 uppercase">{legal?.legalHeader || "legal"}</h4>
						<ul className="space-y-3 text-sm">
							{legal?.legalItems?.map((item, i) => (
								<li key={i}>
									<Link
										href={item.link?.url || "#"}
										className="text-white/80 no-underline transition-colors hover:text-white"
									>
										{item.link?.label || "#"}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* copyright notice section. */}
				<div className="mt-8 border-t border-white/20 pt-8">
					<div className="flex items-center justify-center">
						<p className="text-sm text-white/60">
							{/* dynamically inserts the current year and the copyright text from payload. */}
							&copy; {new Date().getFullYear()} {copyright}
						</p>
					</div>
				</div>
			</Container>
		</div>
	);
};

// export the client component for use by the server-side footer component.
export { FooterClient };
