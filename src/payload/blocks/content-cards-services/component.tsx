import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContentCardsServices } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";

// renders a feature section displaying a series of service cards in a grid-like layout.
// this component consumes data from the 'ContentCardServices' Payload block.
const ContentCardsServicesBlock = ({ gridCards, headline, subheadline }: ContentCardsServices) => {
	return (
		// section provides consistent spacing and a subtle background for visual separation.
		<section className="section-spacing bg-bg-subtle">
			<Container>
				{/* standard block header for the section, horizontally centered. */}
				<div className="mb-16 space-y-4 text-center">
					{/* ensures the primary headline text fits cleanly on various line breaks. */}
					<h2 className="text-balance">{headline}</h2>
					{/* centers the subheadline text block and limits its width for readability. */}
					<p className="text-text-default mx-auto max-w-2xl text-lg">{subheadline}</p>
				</div>

				{/* container for the map loop, applying consistent vertical spacing between card rows. */}
				<div className="space-y-16">
					{gridCards.map((card, index) => {
						// safely extract image properties from the Payload upload field.
						const image = card?.cardImage;
						const imageSrc = image && typeof image === "object" && "url" in image && image.url ? image.url : "";
						const imageAlt = image && typeof image === "object" && "alt" in image && image.alt ? image.alt : "";
						// determines if the current card's index is even, used for layout alternating.
						const isEven = index % 2 === 0;

						return (
							<Card
								key={index}
								// consistent styling and hover effects for visual feedback.
								className="border-border-subtle hover:border-brand-primary-light h-full overflow-hidden rounded-xl bg-white p-0 transition-all duration-300 hover:shadow-lg"
							>
								{/* defines a responsive 2-column grid layout for desktop. */}
								<div className={`grid gap-0 lg:grid-cols-2 ${!isEven ? "lg:grid-flow-dense" : ""}`}>
									{/* image container: alternates position on even/odd cards. */}
									<div
										className={`relative flex h-80 items-center justify-center bg-white p-3 md:h-96 ${!isEven ? "lg:col-start-2" : ""}`}
									>
										{/* conditional class moves the image to the second column on odd indices, creating a staggered effect. */}
										<div className="relative h-full w-full overflow-hidden rounded-xl border-2">
											{/* next/image component for optimization, using object-cover to ensure the image fills the container. */}
											<Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
										</div>
									</div>

									{/* content container: flexible column layout to vertically center content. */}
									<CardContent className="flex flex-col justify-center p-8">
										<h3 className="mb-5 text-2xl font-bold lg:text-3xl">{card.cardTitle}</h3>
										<p className="text-muted-foreground mb-10 text-lg">{card.cardDescription}</p>

										{/* button uses 'asChild' to render the link inside the button styles. */}
										<Button
											asChild
											variant="default"
											// 'w-fit' overrides flex-col default stretching, and 'mx-auto' is not needed here
											// because the button is left-aligned in its flex container.
											className="bg-brand-accent hover:bg-brand-accent/90 w-fit rounded-lg"
										>
											<Link href={card.cardLink}>Learn More</Link>
										</Button>
									</CardContent>
								</div>
							</Card>
						);
					})}
				</div>
			</Container>
		</section>
	);
};

export { ContentCardsServicesBlock };
