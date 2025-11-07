import { Container } from "@/components/container";
import { RichText } from "@/components/rich-text";
import { ContentCopy } from "@/payload-types";

/* renders a structured text block within a responsive container.
   intended for displaying editorial or marketing copy while preserving layout consistency. */
const ContentCopyBlock = ({ copy }: ContentCopy) => {
	return (
		<section className="section-spacing bg-bg-subtle">
			<Container>
				{/* only render if content exists to avoid empty layout space.
			    limits text width for optimal readability and disables outer gutters for alignment control. */}
				{copy && <RichText className="mx-auto max-w-4xl" data={copy} enableGutter={false} />}
			</Container>
		</section>
	);
};

export { ContentCopyBlock };
