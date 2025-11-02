import { Container } from "@/components/container";
import { HeroSecondary } from "@/payload-types";
import Image from "next/image";

/* 
   defines the secondary hero block that visually complements the primary hero.
   emphasizes balance between descriptive text and imagery while maintaining layout consistency.
*/
const HeroSecondaryBlock = ({ headline, subHeadline, media }: HeroSecondary) => {
	// extract image source and alt text safely from payload data to avoid runtime errors
	const imageSrc = typeof media === "object" && "url" in media && media.url ? media.url : "";
	const imageAlt = typeof media === "object" && "alt" in media && media.alt ? media.alt : "";

	return (
		<section className="section-spacing bg-white">
			<Container>
				{/* layout uses responsive two-column design for clear text-image separation */}
				<div className="mx-auto flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">
					{/* text column providing context and focus for accompanying media */}
					<div className="w-full lg:w-1/2">
						<h2 className="text-brand-primary text-4xl font-semibold md:text-5xl">{headline}</h2>
						<p className="text-text-default text-lg md:text-xl">{subHeadline}</p>
					</div>

					{/* image column maintaining aspect ratio and visual balance */}
					<div className="w-full lg:w-1/2">
						<div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
							<Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
};

export { HeroSecondaryBlock };
