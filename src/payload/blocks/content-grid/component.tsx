import { Container } from "@/components/container";
import { ContentGrid } from "@/payload-types";

/* renders a content grid section with a headline, subheadline, and up to four content items.
   designed for visually balanced layouts that highlight concise information blocks.
   ideal for showcasing features, services, or key selling points in a structured format. */
const ContentGridBlock = ({ gridItems, headline, subheadline }: ContentGrid) => {
	return (
		<section className="section-spacing bg-bg-subtle">
			<Container>
				{/* section header providing context and visual hierarchy */}
				<div className="mb-16 space-y-4 text-center">
					<h2 className="text-balance">{headline}</h2>
					<p className="text-text-default mx-auto max-w-2xl text-lg">{subheadline}</p>
				</div>

				{/* responsive grid layout that adapts to screen size while maintaining clarity */}
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
					{gridItems.map((item, index) => (
						<div key={index} className="relative">
							{/* card container using subtle elevation and spacing for readability */}
							<div className="border-border-subtle h-full rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
								{/* top marker or symbol giving each item visual distinction */}
								<div className="text-brand-accent font-heading mb-4 text-6xl font-bold">{item.itemHead}</div>

								{/* concise heading summarizing the content focus */}
								<h3 className="text-text-primary font-heading mb-3 text-xl font-semibold">{item.itemTitle}</h3>

								{/* supporting description conveying more context */}
								<p className="text-text-muted leading-relaxed">{item.itemDescription}</p>
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
};

export { ContentGridBlock };
