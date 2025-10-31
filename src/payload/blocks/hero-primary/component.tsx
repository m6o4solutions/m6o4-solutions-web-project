import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { HeroPrimary } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";

/**
 * a layout block component for rendering the primary hero section of a page.
 * it features a large headline, sub-headline, call-to-action buttons, and a media element (image).
 */
const HeroPrimaryBlock = ({ ctaItems, headline, media, subHeadline }: HeroPrimary) => {
	// safely extract the image url from the payload image object, checking for object type and 'url' property.
	const imageSrc = typeof media === "object" && "url" in media && media.url ? media.url : "";
	// safely extract the alt text, checking for object type and 'alt' property.
	const imageAlt = typeof media === "object" && "alt" in media && media.alt ? media.alt : "";

	return (
		// wrap the entire section in a container for consistent max-width and padding.
		<Container className="text-center">
			{/* content wrapper for text and ctas, centered and limited in width. */}
			<div className="mx-auto max-w-5xl space-y-8 text-center">
				{/* primary, attention-grabbing headline. */}
				<h1 className="text-brand-primary text-balance">{headline}</h1>
				{/* supporting sub-headline with slightly smaller text. */}
				<p className="text-text-default mx-auto max-w-3xl text-xl md:text-2xl">{subHeadline}</p>

				{/* call to action buttons wrapper. */}
				<div className="">
					{/* map over the cta items array to render buttons. */}
					{ctaItems?.map(({ link }, index) => (
						<Button
							key={index}
							asChild
							size="lg"
							className="bg-brand-accent hover:bg-brand-accent-hover rounded-xl px-8 py-4 text-lg font-medium text-white shadow-md transition-all hover:shadow-lg"
						>
							{/* link component rendered inside the button due to 'aschild'. */}
							<Link href={link.url || "#"} target={link.newTab ? "_blank" : "_self"}>
								{link.label || "#"}
							</Link>
						</Button>
					))}
				</div>
			</div>

			{/* image display section. */}
			<div className="pt-12">
				{/* container for the image with a fixed aspect ratio and styling. */}
				<div className="from-brand-primary to-brand-primary-light relative aspect-video h-96 w-full overflow-hidden rounded-2xl bg-linear-to-br shadow-2xl">
					{/* render the image using next/image for optimization. */}
					<Image
						src={imageSrc}
						alt={imageAlt}
						fill
						priority // prioritize loading as this is the lcp element.
						className="object-cover" // ensures the image covers the container without distortion.
					/>
				</div>
			</div>
		</Container>
	);
};

// export the block component.
export { HeroPrimaryBlock };
