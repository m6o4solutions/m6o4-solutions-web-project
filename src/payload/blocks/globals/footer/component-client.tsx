import { Container } from "@/components/container";
import type { Footer } from "@/payload-types";
import { Facebook, Globe, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FooterClientProps {
	data: Footer;
}

// helper function to check url or label for keywords
const getSocialIcon = (urlOrLabel: string) => {
	const value = urlOrLabel.toLowerCase();

	if (value.includes("linkedin")) return <Linkedin className="size-5" />;
	if (value.includes("facebook")) return <Facebook className="size-5" />;
	if (value.includes("twitter") || value.includes("x.com")) return <Twitter className="size-5" />;

	// fallback icon
	return <Globe className="size-5" />;
};

const FooterClient = async ({ data }: FooterClientProps) => {
	// declare varibales
	const business = data?.business;
	const copyright = data?.copyright;
	const image = data?.organizationLogo;
	const legal = data?.legal;
	const name = data?.organizationName;
	const services = data?.services;
	const slogan = data?.organizationSlogan;
	const socialItems = data?.socialItems;

	// safely extract the image url from the payload image object, falling back to an empty string
	const imageSrc = typeof image === "object" && "url" in image && image.url ? image.url : "";
	// safely extract the alt text, falling back to an empty string
	const imageAlt = typeof image === "object" && "alt" in image && image.alt ? image.alt : "";

	return (
		<div className="bg-[#1C2A3A] text-white">
			<Container>
				<div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
					{/* organization logo and name */}
					<div className="space-y-4">
						<Link href="/" className="flex items-center space-x-2">
							<div className="relative size-8 shrink-0">
								<Image src={imageSrc} alt={imageAlt} fill priority className="object-cover text-white/80" />
							</div>
							<div className="text-2xl font-semibold text-white/80">{name}</div>
						</Link>

						{/* organization slogan */}
						<p className="text-sm text-white/80">{slogan}</p>

						{/* social links */}
						{socialItems && socialItems.length > 0 && (
							<div className="flex items-center gap-4">
								{socialItems.map((item, index) => {
									const href = item.link?.url || "#";
									const label = item.link?.label || "#";
									const icon = getSocialIcon(href || label);

									return (
										<Link
											key={index}
											href={href}
											target="_blank"
											rel="noopener noreferrer"
											className="text-white/80 transition-colors hover:text-white"
											aria-label={label}
										>
											{icon}
										</Link>
									);
								})}
							</div>
						)}
					</div>

					{/* services links */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-white/80 uppercase">{services?.serviceHeader || "Services"}</h4>
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

					{/* business links */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-white/80 uppercase">{business?.businessHeader || "Business"}</h4>
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

					{/* legal links */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-white/80 uppercase">{legal?.legalHeader || "Legal"}</h4>
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

				{/* copyright notice */}
				<div className="mt-8 border-t border-white/20 pt-8">
					<div className="flex items-center justify-center">
						<p className="text-sm text-white/60">
							&copy; {new Date().getFullYear()} {copyright}
						</p>
					</div>
				</div>
			</Container>
		</div>
	);
};

export { FooterClient };
