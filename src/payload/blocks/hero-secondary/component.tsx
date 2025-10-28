import { Container } from "@/components/container";
import { HeroSecondary } from "@/payload-types";
import Image from "next/image";

/* renders a secondary hero section with a headline, subheadline, and image.
   designed for flexibility across layouts while preserving accessibility and performance. */
const HeroSecondaryBlock = ({ media, headline, subHeadline }: HeroSecondary) => {
	/* extract image source safely from a potentially nested or undefined payload object.
	   ensures no runtime error occurs if media is missing or incorrectly structured. */
	const imageSrc = typeof media === "object" && "url" in media && media.url ? media.url : "";

	/* extract alternative text safely for accessibility and seo benefit. */
	const imageAlt = typeof media === "object" && "alt" in media && media.alt ? media.alt : "";

	return (
		<Container className="mx-auto flex flex-col space-y-6 px-6 py-10 lg:h-128 lg:flex-row lg:items-center lg:py-16">
			{/* text content section that scales responsively and keeps readability priority */}
			<div className="w-full lg:w-1/2">
				<div className="lg:max-w-lg">
					<h1 className="text-brand-primary text-3xl tracking-wide text-balance lg:text-4xl">{headline}</h1>
					<p className="text-text-default mt-4">{subHeadline}</p>
				</div>
			</div>

			{/* responsive image section ensuring aspect consistency and proper layout behavior */}
			<div className="relative flex h-96 w-full items-center justify-center lg:w-1/2">
				<Image
					src={imageSrc}
					alt={imageAlt}
					fill
					priority
					className="h-full w-full max-w-3xl rounded-md object-cover"
				/>
			</div>
		</Container>
	);
};

export { HeroSecondaryBlock };
