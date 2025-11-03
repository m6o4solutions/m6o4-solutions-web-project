import { Container } from "@/components/container";
import { ContentGrid } from "@/payload-types";
import {
	Ban,
	Brain,
	Check,
	ChevronsDown,
	ChevronsUp,
	Cloud,
	Cpu,
	DollarSign,
	Globe,
	Shield,
	TrendingDown,
	TrendingUp,
	Zap,
} from "lucide-react";
import { ElementType } from "react";

// maps string keys from the cms to lucide icon components
const iconMap: Record<string, ElementType> = {
	ban: Ban,
	brain: Brain,
	chevronsDown: ChevronsDown,
	chevronsUp: ChevronsUp,
	cloud: Cloud,
	cpu: Cpu,
	check: Check,
	dollarSign: DollarSign,
	globe: Globe,
	shield: Shield,
	trendingDown: TrendingDown,
	trendingUp: TrendingUp,
	zap: Zap,
};

// renders a structured content grid with optional icons or text markers
const ContentGridBlock = ({ columns, gridItems, headline, subheadline }: ContentGrid) => {
	return (
		<section className="bg-bg-subtle section-spacing">
			<Container>
				{/* section header introducing the grid content and setting hierarchy */}
				<div className="mb-16 space-y-4 text-center">
					<h2 className="text-balance">{headline}</h2>
					<p className="text-text-default mx-auto max-w-2xl text-lg">{subheadline}</p>
				</div>

				{/* responsive grid maintaining balance across screen sizes */}
				<div
					className={`grid grid-cols-1 gap-8 md:grid-cols-2 ${columns === "3" ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
				>
					{gridItems.map((item, index) => {
						const headType = item.itemHead?.type;
						const IconComponent = item.itemHead?.icon ? iconMap[item.itemHead.icon] : null;

						return (
							<div key={index} className="relative">
								{/* card container emphasizing structure and readability */}
								<div className="border-border-subtle h-full rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
									{/* header element giving each item a distinct visual marker */}
									<div className="font-heading text-brand-accent mb-4 flex items-center justify-start text-6xl font-bold">
										{headType === "text" && item.itemHead?.text}

										{headType === "icon" && IconComponent && (
											<div className="bg-brand-accent/10 mb-4 flex size-12 items-center justify-center rounded-lg">
												<IconComponent className="text-brand-accent size-8" strokeWidth={1.5} />
											</div>
										)}
									</div>

									{/* primary item title summarizing its key message */}
									<h3 className="text-text-primary font-heading mb-3 text-xl font-semibold">{item.itemTitle}</h3>

									{/* supporting paragraph providing further context */}
									<p className="text-text-muted leading-relaxed">{item.itemDescription}</p>
								</div>
							</div>
						);
					})}
				</div>
			</Container>
		</section>
	);
};

export { ContentGridBlock };
