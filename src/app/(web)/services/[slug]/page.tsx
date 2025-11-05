// renders individual service pages dynamically based on the service slug
// supports both published and draft data for preview mode via Payload CMS
// designed for flexibility between traditional pricing and SaaS-based offerings

import { Container } from "@/components/container";
import { PayloadRedirects } from "@/components/payload-redirects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMeta } from "@/payload/utilities/generate-meta";
import config from "@payload-config";
import {
	Ban,
	Brain,
	Check,
	ChevronsDown,
	ChevronsUp,
	Clock,
	Cloud,
	Cpu,
	DollarSign,
	Globe,
	Search,
	Shield,
	TrendingDown,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import { cache, ElementType } from "react";

// maps string identifiers from the CMS to lucide icons for visual consistency
const iconMap: Record<string, ElementType> = {
	ban: Ban,
	brain: Brain,
	chevronsDown: ChevronsDown,
	chevronsUp: ChevronsUp,
	cloud: Cloud,
	clock: Clock,
	cpu: Cpu,
	check: Check,
	dollarSign: DollarSign,
	globe: Globe,
	search: Search,
	shield: Shield,
	trendingDown: TrendingDown,
	trendingUp: TrendingUp,
	users: Users,
	zap: Zap,
};

// fetches available service slugs for static path generation during build
const generateStaticParams = async () => {
	const payload = await getPayload({ config });
	const services = await payload.find({
		collection: "services",
		draft: false,
		limit: 100,
		overrideAccess: false,
		pagination: false,
		select: { slug: true },
	});
	return services.docs.map(({ slug }) => ({ slug }));
};

type Args = { params: Promise<{ slug?: string }> };

// caches the query to improve performance and prevent redundant fetches per render
const queryServiceBySlug = cache(async ({ slug }: { slug: string }) => {
	const { isEnabled: draft } = await draftMode();
	const payload = await getPayload({ config });
	const result = await payload.find({
		collection: "services",
		draft,
		limit: 1,
		overrideAccess: draft,
		pagination: false,
		where: { slug: { equals: slug } },
	});
	return result.docs?.[0] || null;
});

// builds seo metadata dynamically based on the queried service document
const generateMetadata = async ({ params: paramsPromise }: Args): Promise<Metadata> => {
	const { slug = "" } = await paramsPromise;
	const service = await queryServiceBySlug({ slug });
	return generateMeta({ doc: service });
};

// main page component for rendering a full service layout with conditional sections
const Page = async ({ params: paramsPromise }: Args) => {
	const { slug = "" } = await paramsPromise;
	const url = "/services/" + slug;
	const service = await queryServiceBySlug({ slug });

	// redirects if service not found or unpublished
	if (!service) return <PayloadRedirects url={url} />;

	const { benefits, enablePricing, enableSaaS, features, hero, pricing, saas } = service;

	// safely extracts image metadata for hero, features, and saas cards
	const image = hero?.media;
	const imageSrc = typeof image === "object" && "url" in image && image.url ? image.url : "";
	const imageAlt = typeof image === "object" && "alt" in image && image.alt ? image.alt : "";
	const benefitsGrid = benefits?.serviceBenefits;
	const featuresCard = features?.serviceFeatures;
	const pricingCard = pricing?.servicePricing;
	const saasCard = saas?.saasDetails;

	return (
		<section>
			{/* ensures correct behavior for redirects and draft states */}
			<PayloadRedirects disableNotFound url={url} />

			{/* hero section introducing the service visually and contextually */}
			<section className="section-spacing bg-white">
				<Container>
					<div className="flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">
						<div className="w-full space-y-6 lg:w-1/2">
							<h1 className="text-brand-primary text-4xl font-semibold md:text-5xl">{hero.headline}</h1>
							<p className="text-text-default text-lg md:text-xl">{hero.subHeadline}</p>
						</div>
						<div className="w-full lg:w-1/2">
							<div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
								<Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
							</div>
						</div>
					</div>
				</Container>
			</section>

			{/* benefits section highlighting core value propositions */}
			<section className="section-spacing bg-bg-subtle">
				<Container>
					<div className="mb-16 space-y-4 text-center">
						<h2 className="text-balance">{benefits.headline}</h2>
						<p className="text-text-default mx-auto max-w-2xl text-lg">{benefits.subheadline}</p>
					</div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{benefitsGrid?.map((benefit, index) => {
							const symbolType = benefit.benefitSymbol?.type;
							const IconComponent = benefit.benefitSymbol?.icon ? iconMap[benefit.benefitSymbol?.icon] : null;

							return (
								<div key={index} className="relative">
									<div className="border-border-subtle h-full rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
										<div className="font-heading text-brand-accent mb-4 flex items-center justify-start text-6xl font-bold">
											{symbolType === "text" && benefit.benefitSymbol?.text}
											{symbolType === "icon" && IconComponent && (
												<div className="bg-brand-accent/10 mb-4 flex size-12 items-center justify-center rounded-lg">
													<IconComponent className="text-brand-accent size-8" strokeWidth={1.5} />
												</div>
											)}
										</div>
										<h3 className="text-text-primary font-heading mb-3 text-xl font-semibold">
											{benefit.benefitTitle}
										</h3>
										<p className="text-text-muted leading-relaxed">{benefit.benefitDescription}</p>
									</div>
								</div>
							);
						})}
					</div>
				</Container>
			</section>

			{/* features section outlining functional or technical differentiators */}
			<section className="section-spacing bg-white">
				<Container>
					<div className="mb-16 space-y-4 text-center">
						<h2 className="text-balance">{features.headline}</h2>
						<p className="text-text-default mx-auto max-w-2xl text-lg">{features.subheadline}</p>
					</div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{featuresCard?.map((feature, index) => {
							const image = feature.featureImage;
							const imageSrc = image && typeof image === "object" && "url" in image && image.url ? image.url : "";
							const imageAlt = image && typeof image === "object" && "alt" in image && image.alt ? image.alt : "";

							return (
								<div key={index} className="group">
									<Card className="border-border-subtle hover:border-brand-primary-light h-full overflow-hidden rounded-xl bg-white p-0 transition-all duration-300 hover:shadow-lg">
										<div className="relative h-48 w-full overflow-hidden">
											<Image
												src={imageSrc}
												alt={imageAlt}
												fill
												priority
												className="object-cover transition-transform duration-300 group-hover:scale-105"
											/>
										</div>
										<div className="px-6 pt-6 pb-2">
											<CardTitle className="text-text-default group-hover:text-brand-primary transition-colors">
												{feature.featureTitle}
											</CardTitle>
										</div>
										<CardContent className="px-6 pt-2 pb-6">
											<CardDescription className="text-text-default/80 text-base leading-relaxed">
												{feature.featureDescription}
											</CardDescription>
										</CardContent>
									</Card>
								</div>
							);
						})}
					</div>
				</Container>
			</section>

			{/* conditional rendering for pricing-based services */}
			{enablePricing && !enableSaaS && (
				<section className="section-spacing bg-bg-subtle">
					<Container>
						<div className="mb-16 space-y-4 text-center">
							<h2 className="text-balance">{pricing?.headline}</h2>
							<p className="text-text-default mx-auto max-w-2xl text-lg">{pricing?.subheadline}</p>
						</div>

						<div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
							{pricingCard?.map((price, index) => (
								<Card
									key={index}
									className={`relative ${price.popularSubscription ? "border-brand-accent border-2 shadow-lg" : ""}`}
								>
									{/* visual highlight for the most popular subscription tier */}
									{price.popularSubscription && (
										<div className="absolute -top-4 left-1/2 -translate-x-1/2">
											<span className="bg-brand-accent rounded-full px-4 py-1 text-sm font-semibold text-white">
												Most Popular
											</span>
										</div>
									)}
									<CardHeader className="pb-8 text-center">
										<CardTitle className="mb-2 text-2xl">{price.priceTitle}</CardTitle>
										<CardDescription className="text-base">{price.priceDescription}</CardDescription>
										<div className="mt-4">
											<div className="text-muted-foreground mb-1 text-sm">Project-Based Setup Fee</div>
											<div className="text-brand-primary text-3xl font-bold">{price.price}</div>
											{Boolean(price.enableSubscription) && (
												<>
													<div className="text-muted-foreground mt-3 mb-1 text-sm">Monthly Subscription</div>
													<div className="text-2xl font-bold">
														{price.subscriptionPrice}
														<span className="text-muted-foreground text-base font-normal">/month</span>
													</div>
												</>
											)}
										</div>
									</CardHeader>
									<CardContent>
										<ul className="mb-6 space-y-3 px-3">
											{price.perks?.map((pricePerk) => (
												<li key={pricePerk.id} className="flex gap-3">
													<Check className="text-brand-accent mt-0.5 size-5 shrink-0" />
													<span className="text-sm">{pricePerk.perk}</span>
												</li>
											))}
										</ul>
										<div>
											{price.cta?.map((ctaLink, index) => (
												<Button
													key={index}
													asChild
													variant="default"
													className={`w-full rounded-lg ${price.popularSubscription ? "bg-brand-accent hover:bg-brand-accent/90" : "bg-brand-primary hover:bg-brand-primary/90"}`}
												>
													<Link href={ctaLink.link.url || "#"} target={ctaLink.link.newTab ? "_blank" : "_self"}>
														{ctaLink.link.label || "#"}
													</Link>
												</Button>
											))}
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</Container>
				</section>
			)}

			{/* conditional rendering for SaaS-oriented service offerings */}
			{enableSaaS && !enablePricing && (
				<section className="section-spacing bg-bg-subtle">
					<Container>
						<div className="mb-16 space-y-4 text-center">
							<h2 className="text-balance">{saas?.headline}</h2>
							<p className="text-text-default mx-auto max-w-2xl text-lg">{saas?.subheadline}</p>
						</div>

						<div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
							{saasCard?.map((app, index) => {
								const image = app.saasImage;
								const imageSrc = image && typeof image === "object" && "url" in image && image.url ? image.url : "";
								const imageAlt = image && typeof image === "object" && "alt" in image && image.alt ? image.alt : "";

								return (
									<div key={index} className="group">
										<Card className="border-border-subtle hover:border-brand-primary-light h-full overflow-hidden rounded-xl bg-white p-0 transition-all duration-300 hover:shadow-lg">
											<div className="relative h-96 w-full overflow-hidden">
												<Image
													src={imageSrc}
													alt={imageAlt}
													fill
													priority
													className="object-cover transition-transform duration-300 group-hover:scale-105"
												/>
											</div>
											<div className="px-6 pt-6 pb-2">
												<CardTitle className="text-text-default group-hover:text-brand-primary px-3 transition-colors">
													{app.saasName}
												</CardTitle>
											</div>
											<CardContent className="space-y-6 px-6 pt-2 pb-6">
												<CardDescription className="text-text-default/80 mb-6 space-y-3 px-3 text-base leading-relaxed">
													{app.saasDescription}
												</CardDescription>
												<div>
													{app.cta?.map((ctaLink, index) => (
														<Button
															key={index}
															asChild
															variant="default"
															className="bg-brand-accent hover:bg-brand-accent/90 w-full rounded-lg"
														>
															<Link href={ctaLink.link.url || "#"} target={ctaLink.link.newTab ? "_blank" : "_self"}>
																{ctaLink.link.label || "#"}
															</Link>
														</Button>
													))}
												</div>
											</CardContent>
										</Card>
									</div>
								);
							})}
						</div>
					</Container>
				</section>
			)}
		</section>
	);
};

export { Page as default, generateStaticParams, generateMetadata };
