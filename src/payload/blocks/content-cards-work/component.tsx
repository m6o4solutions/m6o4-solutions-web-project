import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContentCardsWork, Work } from "@/payload-types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ContentCardsWorkBlock = ({ headline, subheadline, work }: ContentCardsWork) => {
	// ensure only fully resolved work objects are used, excluding string references
	const isPopulatedWork = (item: string | Work): item is Work =>
		typeof item !== "string" && item !== null && typeof item === "object";

	// filter out invalid or unresolved work references
	const resolvedWork = work?.filter(isPopulatedWork);

	return (
		<section className="section-spacing bg-bg-subtle">
			<Container>
				{/* section intro with headline and supporting subtext */}
				<div className="mb-16 space-y-4 text-center">
					<h2 className="text-balance">{headline}</h2>
					<p className="text-text-default mx-auto max-w-2xl text-lg">{subheadline}</p>
				</div>

				{/* render each case study card */}
				<div className="space-y-16">
					{resolvedWork.map((study, index) => {
						// safely extract image source and alt text, accounting for different Payload formats
						const image = study.image;
						let imageSrc = "";
						let imageAlt = "";

						if (image && typeof image === "object" && "url" in image) {
							imageSrc = image.url || "";
							imageAlt = image.alt || "";
						} else if (typeof image === "string") {
							imageSrc = image;
						}

						return (
							<Card
								key={study.id}
								className="hover:border-brand-primary overflow-hidden border-2 bg-white p-0 transition-colors"
							>
								{/* alternate image layout per row for visual balance */}
								<div className={`grid gap-0 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
									{/* image container maintaining consistent framing */}
									<div
										className={`relative flex h-[300px] items-center justify-center bg-white p-3 lg:h-auto ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
									>
										<div className="relative h-full w-full overflow-hidden rounded-xl border-2">
											{imageSrc && (
												<Image
													src={imageSrc}
													alt={imageAlt || `${study.title} case study`}
													fill
													className="object-cover object-top"
												/>
											)}
										</div>
									</div>

									{/* text content: service type, overview, and case details */}
									<CardContent className="flex flex-col justify-center p-8 lg:p-10">
										<Badge className="bg-brand-accent mb-4 w-fit text-white">
											{study.service === "waas" ? "Website as a Service" : "Chief Technology Officer as a Service"}
										</Badge>

										<h3 className="mb-2 text-2xl font-bold lg:text-3xl">{study.title}</h3>
										<p className="text-muted-foreground mb-6 text-sm">{study.industry}</p>

										{/* structured narrative: challenge, solution, and results */}
										<div className="space-y-6">
											<div>
												<h4 className="text-brand-primary mb-2 font-semibold">Challenge</h4>
												<p className="text-muted-foreground">{study.challenge}</p>
											</div>

											<div>
												<h4 className="text-brand-primary mb-2 font-semibold">Solution</h4>
												<p className="text-muted-foreground">{study.solution}</p>
											</div>

											<div>
												<h4 className="text-brand-primary mb-2 font-semibold">Results</h4>
												<ul className="space-y-2">
													{study.results?.map((result, idx) => (
														<li key={idx} className="flex items-start gap-2">
															<span className="text-brand-accent mt-1">✓</span>
															<span className="text-muted-foreground">{result.result}</span>
														</li>
													))}
												</ul>
											</div>

											{/* show link button only for waas projects */}
											{study.service === "waas" && study.solutionLink && (
												<div className="pt-4">
													<Button asChild className="bg-brand-accent hover:bg-brand-accent-hover gap-2 rounded-lg">
														<Link href={study.solutionLink} target="_blank" rel="noopener noreferrer">
															Visit Website
															<ExternalLink className="size-4" />
														</Link>
													</Button>
												</div>
											)}
										</div>
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

export { ContentCardsWorkBlock };
