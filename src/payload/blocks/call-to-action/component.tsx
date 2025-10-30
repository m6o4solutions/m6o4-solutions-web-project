import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { CallToAction, Cta } from "@/payload-types";
import config from "@payload-config";
import Link from "next/link";
import { getPayload } from "payload";

// renders a dynamic call-to-action section using cms data
// accepts either a populated cta object or an id reference and resolves it before rendering
const CallToActionBlock = async ({ cta }: CallToAction) => {
	let data: Cta;

	// when the cta relationship is already populated, use it directly
	if (typeof cta === "object" && cta !== null && "title" in cta) {
		data = cta as Cta;
	}
	// when only the cta id is available, fetch the full document from payload
	else if (typeof cta === "string") {
		const payload = await getPayload({ config });
		const result = await payload.findByID({
			collection: "cta",
			id: cta,
		});
		data = result as Cta;
	}
	// throw an error if cta is neither a valid object nor an id reference
	else {
		throw new Error("invalid call to action data");
	}

	// destructure key fields for display
	const { title, content, navigationItems } = data;

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
