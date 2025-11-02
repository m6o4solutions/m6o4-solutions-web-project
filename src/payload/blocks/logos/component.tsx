import { Container } from "@/components/container";
import { Logos } from "@/payload-types";
import Image from "next/image";

/* renders a grid of partner or client logos with a heading and subheading.
   supports both populated logo objects and direct string references, ensuring flexibility across use cases. */
const LogosBlock = ({ companyLogos, headline, subheadline }: Logos) => {
	return (
		<section className="bg-white py-16">
			<Container>
				{/* section heading with centered layout for visual hierarchy */}
				<div className="mb-16 space-y-4 text-center">
					<h2 className="text-balance">{headline}</h2>
					<p className="text-text-default mx-auto max-w-2xl text-lg">{subheadline}</p>
				</div>

				{/* logo grid with hover interactions for subtle motion and polish */}
				<div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
					{companyLogos?.map((item, index) => {
						// gracefully handle different data structures for logo references
						let imageSrc = "";
						let imageAlt = "";

						if (typeof item === "string") {
							// logo provided directly as a string URL
							imageSrc = item;
						} else if (item && typeof item === "object") {
							// logo provided as a related document reference
							const image = item.logo;
							if (typeof image === "string") {
								imageSrc = image;
							} else if (image && typeof image === "object") {
								imageSrc = "url" in image && image.url ? image.url : "";
								imageAlt = "alt" in image && image.alt ? image.alt : "";
							}
						}

						return (
							<div
								key={index}
								className="border-border-subtle group flex items-center justify-center rounded-lg border p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
							>
								<Image
									src={imageSrc}
									alt={imageAlt}
									width={200}
									height={100}
									className="h-24 w-auto object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
								/>
							</div>
						);
					})}
				</div>
			</Container>
		</section>
	);
};

export { LogosBlock };
