import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { CallToAction } from "@/payload-types";
import Link from "next/link";

// renders a dynamic call-to-action section using cms data
// accepts either a populated cta object or an id reference and resolves it before rendering
const CallToActionBlock = ({ cta }: CallToAction) => {
	// if cta is not populated for some reason, skip rendering
	if (!cta || typeof cta !== "object") return null;

	// destructure key fields for display
	const { title, content, navigationItems } = cta;

	return (
		<section className="section-spacing bg-brand-primary text-white">
			<Container>
				{/* center content with consistent spacing and styling */}
				<div className="mx-auto max-w-4xl space-y-5 text-center">
					<h2 className="text-balance text-white">{title}</h2>
					<p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/90">{content}</p>

					{/* render call-to-action buttons if navigation items exist */}
					<div className="flex justify-center pt-4">
						{navigationItems?.map(({ link }, index) => (
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
			</Container>
		</section>
	);
};

export { CallToActionBlock };
