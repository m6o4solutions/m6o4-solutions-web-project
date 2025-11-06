import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { HeroPrimary } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";

/* renders a visually dominant hero section for primary page intros
   focuses on clarity, emotional impact, and a direct conversion path
   combines background imagery, headline hierarchy, and cta actions in a centered layout */
const HeroPrimaryBlock = ({ ctaItems, headline, media, subHeadline }: HeroPrimary) => {
	/* safely resolve image source and alt text to handle variable payload input structures */
	const imageSrc = typeof media === "object" && "url" in media && media.url ? media.url : "";
	const imageAlt = typeof media === "object" && "alt" in media && media.alt ? media.alt : "";

	return (
		<section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
			{/* background layer with image and overlay for readability and depth */}
			<div className="absolute inset-0 z-0">
				<Image src={imageSrc} alt={imageAlt} fill priority className="h-full w-full object-cover" />
				<div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/60 to-black/70" />
			</div>

			{/* foreground layer containing text and calls to action */}
			<Container className="relative z-10 py-20">
				<div className="mx-auto max-w-5xl space-y-6 text-center">
					<h1 className="text-balance text-white drop-shadow-lg">{headline}</h1>
					<p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/90 drop-shadow-md md:text-2xl">
						{subHeadline}
					</p>

					{/* dynamically render cta buttons to guide user actions */}
					<div className="flex justify-center pt-4">
						{ctaItems?.map(({ link }, index) => (
							<Button
								key={index}
								asChild
								size="lg"
								className="bg-brand-accent hover:bg-brand-accent-hover rounded-xl px-8 py-4 text-lg font-medium text-white shadow-md transition-all hover:shadow-lg"
							>
								<Link href={link.url || "#"} target={link.newTab ? "_blank" : "_self"}>
									{link.label || "#"}
								</Link>
							</Button>
						))}
					</div>
				</div>
			</Container>
		</section>
	);
};

/* exported for integration into dynamic page layouts or reusable hero sections */
export { HeroPrimaryBlock };
