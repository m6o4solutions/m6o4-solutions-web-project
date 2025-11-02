import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { HeroPrimary } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";

/* 
   defines the primary hero block used for high-impact page intros.
   emphasizes headline clarity, visual hierarchy, and a strong call to action.
   layout remains vertically stacked for simplicity and readability across devices.
*/
const HeroPrimaryBlock = ({ ctaItems, headline, media, subHeadline }: HeroPrimary) => {
	// extract image data safely from payload input to prevent runtime errors
	const imageSrc = typeof media === "object" && "url" in media && media.url ? media.url : "";
	const imageAlt = typeof media === "object" && "alt" in media && media.alt ? media.alt : "";

	return (
		<section className="section-spacing">
			<Container>
				{/* content area containing text and calls to action */}
				<div className="mx-auto max-w-5xl space-y-6 text-center">
					<h1 className="text-brand-primary text-balance">{headline}</h1>
					<p className="text-text-default mx-auto max-w-3xl text-xl md:text-2xl">{subHeadline}</p>

					{/* render mapped cta buttons for navigation or conversion */}
					<div>
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

				{/* responsive image area maintaining visual focus below content */}
				<div className="pt-12">
					<div className="from-brand-primary to-brand-primary-light relative aspect-video h-96 w-full overflow-hidden rounded-2xl bg-linear-to-br shadow-2xl">
						<Image src={imageSrc} alt={imageAlt} fill priority className="object-cover" />
					</div>
				</div>
			</Container>
		</section>
	);
};

export { HeroPrimaryBlock };
