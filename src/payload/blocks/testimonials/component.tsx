"use client";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Testimonial, Testimonials } from "@/payload-types";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRef } from "react";

/* displays a horizontally scrollable carousel of testimonials.
   built for smooth navigation and responsive presentation of client feedback. */
const TestimonialsBlock = ({ headline, subheadline, testimonials }: Testimonials) => {
	/* type guard ensuring testimonial data is fully resolved and not a string reference */
	const isPopulatedTestimonial = (testimonial: string | Testimonial): testimonial is Testimonial =>
		typeof testimonial !== "string" && testimonial !== null && typeof testimonial === "object";

	/* filters out unresolved or invalid testimonial references */
	const resolvedTestimonials = testimonials?.filter(isPopulatedTestimonial);

	/* reference to the scroll container for programmatic horizontal scrolling */
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	/* handles left navigation by scrolling one viewport width backward */
	const handlePrevious = () => {
		if (scrollContainerRef.current) {
			const scrollAmount = scrollContainerRef.current.offsetWidth;
			scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
		}
	};

	/* handles right navigation by scrolling one viewport width forward */
	const handleNext = () => {
		if (scrollContainerRef.current) {
			const scrollAmount = scrollContainerRef.current.offsetWidth;
			scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<section className="section-spacing bg-bg-subtle">
			<Container>
				{/* section header introducing testimonial content */}
				<div className="mb-16 space-y-4 text-center">
					<h2 className="text-balance">{headline}</h2>
					<p className="text-text-default mx-auto max-w-2xl text-lg">{subheadline}</p>
				</div>

				{/* horizontally scrollable testimonial list */}
				<div className="relative">
					<div
						ref={scrollContainerRef}
						className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
					>
						{resolvedTestimonials.map((testimony, index) => (
							<Card
								key={index}
								className="border-border-subtle relative w-full shrink-0 snap-start bg-white p-6 lg:w-[calc(33.333%-16px)]"
							>
								{/* decorative quote mark reinforcing testimonial context */}
								<Quote className="text-brand-primary/20 absolute top-6 right-6 h-10 w-10" />

								{/* testimonial body and author details */}
								<div className="relative z-10 flex h-full flex-col space-y-4">
									<p className="text-text-default grow text-base leading-relaxed">{testimony.testimonial}</p>

									<div className="border-border-subtle border-t pt-4">
										<p className="text-text-default font-bold">{testimony.name}</p>
										<p className="text-text-default/60 text-sm">{testimony.job}</p>
									</div>
								</div>
							</Card>
						))}
					</div>

					{/* navigation buttons enabling manual scroll control */}
					<div className="mt-8 flex items-center justify-center gap-4">
						<Button
							variant="outline"
							size="icon"
							onClick={handlePrevious}
							className="rounded-full bg-white"
							aria-label="Scroll left"
						>
							<ChevronLeft className="size-5" />
						</Button>

						<Button
							variant="outline"
							size="icon"
							onClick={handleNext}
							className="rounded-full bg-white"
							aria-label="Scroll right"
						>
							<ChevronRight className="size-5" />
						</Button>
					</div>
				</div>
			</Container>
		</section>
	);
};

export { TestimonialsBlock };
