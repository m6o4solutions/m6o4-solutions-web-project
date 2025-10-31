import { Container } from "@/components/container";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ContentCards } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";

/* renders a section displaying a heading, subheading, and a set of linked cards.
   designed for reusability across pages where related services or content need visual grouping.
   each card presents an image, title, and short description linking to a detailed page.
   hover effects emphasize interactivity and visual hierarchy without overwhelming the layout. */
const ContentCardsBlock = ({ headline, services, subheadline }: ContentCards) => {
	return (
		<section className="section-spacing bg-bg-subtle">
			{/* wraps content within a consistent layout width */}
			<Container>
				{/* introduces the section with a headline and supporting subheadline */}
				<div className="mb-16 space-y-4 text-center">
					<h2 className="text-balance">{headline}</h2>
					<p className="text-text-default mx-auto max-w-2xl text-lg">{subheadline}</p>
				</div>

				{/* displays service cards in a responsive grid */}
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{services?.map((service, index) => {
						// safely extract image details and fall back to empty strings if undefined
						const image = service?.image;
						const imageSrc = typeof image === "object" && "url" in image && image.url ? image.url : "";
						const imageAlt = typeof image === "object" && "alt" in image && image.alt ? image.alt : "";

						return (
							// entire card acts as a link for better accessibility and UX
							<Link key={index} href={service.link} className="group no-underline">
								{/* encapsulates card visuals and content with hover feedback */}
								<Card className="border-border-subtle hover:border-brand-primary-light h-full overflow-hidden rounded-xl bg-white p-0 transition-all duration-300 hover:shadow-lg">
									{/* card image maintains visual engagement through subtle motion */}
									<div className="relative h-96 w-full overflow-hidden">
										<Image
											src={imageSrc}
											alt={imageAlt}
											fill
											priority
											className="object-cover transition-transform duration-300 group-hover:scale-105"
										/>
									</div>

									{/* card heading emphasizes service identity */}
									<div className="px-6 pt-6 pb-2">
										<CardTitle className="text-text-default group-hover:text-brand-primary transition-colors">
											{service.title}
										</CardTitle>
									</div>

									{/* description conveys supporting details to aid comprehension */}
									<CardContent className="px-6 pt-2 pb-6">
										<CardDescription className="text-text-default/80 text-base leading-relaxed">
											{service.description}
										</CardDescription>
									</CardContent>
								</Card>
							</Link>
						);
					})}
				</div>
			</Container>
		</section>
	);
};

export { ContentCardsBlock };
