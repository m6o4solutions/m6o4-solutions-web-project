import { Container } from "@/components/container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Faq, FrequentlyAskedQuestions } from "@/payload-types";

// renders the faq block content on the frontend
// uses data linked from the faq collection to keep content consistent across pages
// type guard ensures each faq entry contains full data, not just an id reference
// the layout emphasizes readability and maintains a clean visual hierarchy
const FrequentlyAskedQuestionsBlock = ({ faqs, headline, subheadline }: FrequentlyAskedQuestions) => {
	// confirm each faq item is a populated object instead of an id string
	const isPopulatedFaq = (faq: string | Faq): faq is Faq => typeof faq !== "string";

	// remove any unpopulated faq references before rendering
	const resolvedFaqs = faqs?.filter(isPopulatedFaq);

	return (
		<section className="section-spacing bg-white">
			<Container>
				{/* header section providing context for the faq group */}
				<div className="mb-16 space-y-4 text-center">
					<h2 className="text-balance">{headline}</h2>
					<p className="text-text-default mx-auto max-w-2xl text-lg">{subheadline}</p>
				</div>

				{/* accordion structure presenting questions and answers interactively */}
				<div className="mx-auto max-w-5xl">
					<Accordion type="single" collapsible className="space-y-4">
						{resolvedFaqs?.map((faq, index) => (
							<AccordionItem
								key={faq.id ?? index}
								value={`item-${index}`}
								className="border-border-subtle rounded-xl border bg-white px-6 transition-shadow hover:shadow-md"
							>
								<AccordionTrigger className="text-text-default hover:text-brand-primary py-6 text-left text-lg font-semibold hover:no-underline">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="text-text-default/80 pb-6 text-base leading-relaxed">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</Container>
		</section>
	);
};

export { FrequentlyAskedQuestionsBlock };
